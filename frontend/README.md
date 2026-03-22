This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production with Docker

The app uses `output: "standalone"` in `next.config.ts`, which produces a minimal production build containing only the files needed to run the server.

### Build the image

```bash
docker build -t jussaw-frontend .
```

### Run the container

```bash
docker run -p 3000:3000 jussaw-frontend
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Environment variables

`NEXT_PUBLIC_*` variables are baked into the bundle at **build time**. Pass them as build args:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  -t jussaw-frontend .
```

Server-only variables (no `NEXT_PUBLIC_` prefix) can be injected at **run time**:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL=postgres://... \
  -e SECRET_KEY=... \
  jussaw-frontend
```

### Custom port or hostname

```bash
docker run -p 8080:8080 -e PORT=8080 -e HOSTNAME=0.0.0.0 jussaw-frontend
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

Add environment variables in `docker-compose.yml` under the `environment` key, or use an env file:

```yaml
services:
  frontend:
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
  jussaw-frontend
```
