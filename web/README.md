Personal portfolio site for [jussaw.com](https://jussaw.com/), built with [Next.js](https://nextjs.org).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Code Quality

This project uses the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) enforced via ESLint and Prettier.

### Linting

```bash
pnpm lint          # Check for lint violations
pnpm lint:fix      # Auto-fix lint violations
```

### Formatting

```bash
pnpm format        # Format all source files with Prettier
pnpm format:check  # Check formatting without writing
```

### Pre-commit hooks

Husky + lint-staged runs Prettier and ESLint automatically on every `git commit`. Commits that introduce lint errors will be blocked.

### Continuous integration

`.github/workflows/quality.yml` runs a single `quality` job on every pull request targeting `main` and on every push to `main`. It uses Node 22 and pnpm 11.5.3, and runs these commands from `web/`, stopping at the first failure:

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

`quality` is a required status check, so it must pass before a pull request can merge into `main`. Running those four commands locally from `web/` reproduces CI exactly.

## Production with Docker

The app uses `output: "standalone"` in `next.config.ts`, which produces a minimal production build containing only the files needed to run the server.

### Build the image

```bash
docker build -t jussaw-web .
```

### Run the container

```bash
docker run -p 3000:3000 jussaw-web
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Environment variables

There are two kinds, injected at different points. Getting them mixed up leaks
secrets, so the split is enforced rather than assumed.

#### Public build-time variables (browser-visible)

`NEXT_PUBLIC_*` values are inlined into the JavaScript bundle by `next build`, so
they are public forever and must be supplied at **build time**. Only the
variables on the allowlist in `src/utils/publicEnv.ts` are wired through; nothing
else reaches the build. Supported variables:

| Variable               | Default              | Purpose                                                                   |
| ---------------------- | -------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://jussaw.com` | Public origin for `metadataBase`, canonical link, Open Graph and JSON-LD. |

`NEXT_PUBLIC_SITE_URL` is validated at build time: it must be an origin-only
`https://` URL (`http://` is accepted for loopback hosts, for local previews),
with no credentials, path, query or fragment. Anything else falls back to the
default rather than publishing a bad origin.

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://staging.jussaw.com \
  -t jussaw-web .
```

Adding a public variable means updating four places together: the allowlist and
its static `process.env.<NAME>` read in `src/utils/publicEnv.ts`, the builder-stage
`ARG` in `Dockerfile`, the `build.args` entry in `docker-compose.yml`, and this
table. The contract test in `src/utils/__tests__/publicEnvBuildContract.test.ts`
fails if they drift apart.

**Never** put a secret behind a `NEXT_PUBLIC_` name or in a `--build-arg`: build
args are recoverable from image history, and the value ships to every visitor.

#### Server-only runtime variables

Variables without the `NEXT_PUBLIC_` prefix are read by the server at **run
time** only. They are never baked into the image and never sent to the browser,
so this is where secrets belong:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL=postgres://... \
  -e SECRET_KEY=... \
  jussaw-web
```

Passing a `NEXT_PUBLIC_*` value with `docker run -e` has no effect — it was
already resolved during the build.

### Custom port or hostname

```bash
docker run -p 8080:8080 -e PORT=8080 -e HOSTNAME=0.0.0.0 jussaw-web
```

### Docker Compose

A `docker-compose.yml` is included for convenience. To build and start:

```bash
docker compose up --build
```

To run in the background:

```bash
docker compose up --build -d
```

To stop:

```bash
docker compose down
```

`docker-compose.yml` declares the public build variables explicitly under
`build.args`, each defaulting to the production value. Override one for a build
by exporting it first:

```bash
NEXT_PUBLIC_SITE_URL=https://staging.jussaw.com docker compose build
```

Server-only runtime variables go under the `environment` key (or an env file) —
never under `build.args`:

```yaml
services:
  web:
    env_file:
      - .env.local
```

### Multiple replicas / load balancing

If you run more than one container instance, set a shared encryption key so Server Actions work across all of them:

```bash
# Generate a key (run once, store securely)
openssl rand -base64 32

docker run -p 3000:3000 \
  -e NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=<your-base64-key> \
  jussaw-web
```
