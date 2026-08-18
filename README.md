# jussaw.com

> Personal portfolio of Justin Sawyer — live at [jussaw.com](https://jussaw.com)

A modern portfolio site built with Next.js 16 and React 19, featuring
scroll-triggered animations and Docker-ready deployment.

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest
- **Deployment**: Docker

## Project Structure

```
jussaw-app/
└── web/      # Next.js application → see web/README.md for setup & deployment
```

## Deployment

Every push to `main` publishes a multi-arch image to
[`ghcr.io/jussaw/jussaw-app`](https://github.com/jussaw/jussaw-app/pkgs/container/jussaw-app):

```bash
docker run -p 3000:3000 ghcr.io/jussaw/jussaw-app:latest
```

The live site runs that image on a Raspberry Pi, deployed by
[jussaw-server](https://github.com/jussaw/jussaw-server) — this repo holds no deploy script.
