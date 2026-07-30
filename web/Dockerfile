FROM node:22-alpine AS base

# Install pnpm (version pinned by the packageManager field in package.json)
RUN corepack enable

# ---- deps stage ----
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN HUSKY=0 pnpm install --frozen-lockfile

# ---- builder stage ----
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public build-time variables, one ARG per entry in PUBLIC_ENV_ALLOWLIST
# (src/utils/publicEnv.ts). Docker exposes ARGs to the environment of RUN
# commands in this stage, which is how `next build` inlines them into the
# client bundle. These values are browser-visible — never declare an ARG here
# for a secret, and never forward the whole environment. Unset falls back to the
# default in publicEnv.ts. Server-only values are runtime env on the runner
# stage instead.
ARG NEXT_PUBLIC_SITE_URL

RUN pnpm build

# ---- runner stage ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and standalone server
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
