#!/usr/bin/env bash
#
# Proves the documented public build-variable contract is real (AUD-20260728-02):
# a value passed through the supported build path — `docker build --build-arg`,
# declared as a builder-stage ARG — actually reaches `pnpm build` and is embedded
# in the emitted markup, and the documented default holds when it is not passed.
#
# Safe by construction: builds only the `builder` stage, runs throwaway
# containers with no network and no published ports, never `docker compose up`,
# never pushes an image, and removes what it created. The injected value is a
# non-routable `.invalid` sentinel, never a secret.
#
# Requires a Docker daemon and the Compose v2 plugin. Run from anywhere:
#   web/scripts/assert-public-build-args.sh

set -euo pipefail

SENTINEL_URL="https://public-build-arg.invalid"
DEFAULT_URL="https://jussaw.com"
WEB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_INJECTED="jussaw-web-buildarg-assert:injected"
IMAGE_DEFAULT="jussaw-web-buildarg-assert:default"

cleanup() {
  docker image rm -f "$IMAGE_INJECTED" "$IMAGE_DEFAULT" >/dev/null 2>&1 || true
}
trap cleanup EXIT

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

# Lists build-output files containing a literal string, empty if none.
matches_in_build_output() {
  docker run --rm --network none --entrypoint sh "$1" -c "grep -rlF -- '$2' .next || true"
}

# The canonical <link> attributes Next emits for a given origin. Asserting on
# this rather than a bare `href="<origin>"` keeps the check discriminating:
# page content repeats the production origin in ordinary links (a project's
# liveUrl is literally https://jussaw.com), so a generic href match would pass
# even if the metadata had fallen back to the wrong origin. Only the metadata
# output carries rel="canonical".
canonical_link() {
  printf 'rel="canonical" href="%s"' "$1"
}

echo "==> Building the builder stage with NEXT_PUBLIC_SITE_URL=$SENTINEL_URL"
docker build \
  --target builder \
  --build-arg "NEXT_PUBLIC_SITE_URL=$SENTINEL_URL" \
  -t "$IMAGE_INJECTED" \
  "$WEB_DIR"

echo "==> Asserting the injected value is embedded in the build output"
[ -n "$(matches_in_build_output "$IMAGE_INJECTED" "$SENTINEL_URL")" ] ||
  fail "build arg NEXT_PUBLIC_SITE_URL=$SENTINEL_URL never reached the build output"
[ -n "$(matches_in_build_output "$IMAGE_INJECTED" "$(canonical_link "$SENTINEL_URL")")" ] ||
  fail "injected origin is not the canonical URL in the emitted metadata"

echo "==> Building the builder stage with no build arg"
docker build \
  --target builder \
  -t "$IMAGE_DEFAULT" \
  "$WEB_DIR"

echo "==> Asserting the documented default holds and nothing leaks in"
[ -z "$(matches_in_build_output "$IMAGE_DEFAULT" "$SENTINEL_URL")" ] ||
  fail "sentinel origin present in a build that never received it"
[ -n "$(matches_in_build_output "$IMAGE_DEFAULT" "$(canonical_link "$DEFAULT_URL")")" ] ||
  fail "default origin $DEFAULT_URL is not the canonical URL in the emitted metadata"

echo "==> Asserting Compose resolves the same named build arg (config only, no up)"
docker compose version >/dev/null 2>&1 ||
  fail "Docker Compose v2 plugin is required for the Compose half of this assertion"
NEXT_PUBLIC_SITE_URL="$SENTINEL_URL" docker compose -f "$WEB_DIR/docker-compose.yml" config |
  grep -qF "$SENTINEL_URL" ||
  fail "docker-compose.yml does not forward NEXT_PUBLIC_SITE_URL as a build arg"
env -u NEXT_PUBLIC_SITE_URL docker compose -f "$WEB_DIR/docker-compose.yml" config |
  grep -qF "$DEFAULT_URL" ||
  fail "docker-compose.yml does not default NEXT_PUBLIC_SITE_URL to $DEFAULT_URL"

echo "PASS: public build variables reach the bundle only through the supported build path"
