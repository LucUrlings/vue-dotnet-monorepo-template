# VueDotnet Monorepo

> A reusable full-stack monorepo template built with Vue 3, Vite, TypeScript,
> ASP.NET Core, Docker, and GitHub Actions.

[![CI](https://github.com/LucUrlings/vue-dotnet-monorepo-template/actions/workflows/ci.yml/badge.svg)](https://github.com/LucUrlings/vue-dotnet-monorepo-template/actions/workflows/ci.yml)
[![Publish containers](https://github.com/LucUrlings/vue-dotnet-monorepo-template/actions/workflows/publish-container.yml/badge.svg)](https://github.com/LucUrlings/vue-dotnet-monorepo-template/actions/workflows/publish-container.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg)](https://www.typescriptlang.org/)
[![.NET 10](https://img.shields.io/badge/.NET-10-512bd4.svg)](https://dotnet.microsoft.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ed.svg)](https://www.docker.com/)

## Overview

VueDotnet Monorepo is a deliberately small starting point with a complete
development and delivery path. It suits personal applications, internal tools,
small production systems, open-source projects, and repository-aware coding
agents.

Vue with Vite keeps the client fast and focused; Nuxt is intentionally absent
because ASP.NET Core owns the backend and this template does not need server-side
rendering. The API begins with controllers, typed models, built-in dependency
injection, OpenAPI, and health checks instead of speculative application layers.

Docker provides separate experiences for source-mounted development and
production-style deployment. GitHub Actions validates both applications and
containers, while version tags publish separate frontend and backend packages to
GitHub Container Registry (GHCR).

## Features

- Vue 3, Vite, strict TypeScript, Vue Router, Pinia, and native `fetch`
- ASP.NET Core 10 controllers with OpenAPI and health checks
- One cross-platform command surface from the repository root
- Hot module replacement and `dotnet watch`
- Relative API requests with Vite and Nginx proxying
- Vitest, Vue Test Utils, xUnit, and ASP.NET Core integration tests
- Source-mounted development containers and production multi-stage images
- CI, multi-architecture GHCR publishing, Trivy scanning, and Dependabot
- Practical instructions for Codex and other repository-aware agents
- MIT License

## Repository structure

```text
.
├── .github/                    # CI, publishing, Dependabot, and community files
├── backend/
│   ├── VueDotnet.Api/          # ASP.NET Core API and production Dockerfile
│   ├── VueDotnet.Api.Tests/    # Unit and integration tests
│   ├── VueDotnet.sln
│   └── README.md
├── docker/
│   ├── compose.dev.yml         # Source-mounted container development
│   ├── compose.server.yml      # Published-image server deployment
│   ├── compose.build.yml       # Production source-build override
│   └── compose.debug.yml       # Optional backend-port override
├── frontend/
│   ├── src/                    # Vue application, API module, router, and store
│   ├── tests/                  # Frontend tests
│   ├── Dockerfile              # Development and production image targets
│   ├── nginx.conf
│   └── README.md
├── scripts/                    # Cross-platform repository helpers
├── AGENTS.md
├── package.json
└── README.md
```

## Prerequisites

- Git
- Node.js 24 LTS and npm
- .NET 10 SDK
- Docker Engine or Docker Desktop with Docker Compose 2.24 or newer

The dependency lock files and digest-pinned container bases provide reproducible
installs while documentation and CI stay on the supported Node 24 and .NET 10
release lines.

## Getting started without Docker

```bash
git clone https://github.com/LucUrlings/vue-dotnet-monorepo-template.git
cd vue-dotnet-monorepo-template
npm run setup
npm run dev
```

Open the frontend at <http://localhost:5173>. The API listens on
<http://localhost:5000>; Vite forwards relative `/api` requests to it. The
terminal prefixes output with `frontend` and `backend`.

## Getting started with Docker

```bash
docker compose -f docker/compose.dev.yml up --build
```

Equivalent root commands:

```bash
npm run docker:dev
npm run docker:dev:build
```

The development stack mounts `frontend/` and `backend/`, keeps frontend modules,
NuGet packages, and container `bin/obj` output in named volumes, runs Vite, and
runs `dotnet watch`. Isolated build-output volumes prevent host and container SDK
patch versions from racing over generated files. Docker
Desktop file events can vary by host; set `CHOKIDAR_USEPOLLING=true` in `.env`
if frontend changes are missed. Backend polling is enabled by default.
On macOS, AirPlay Receiver can reserve port 5000; disable it in System Settings
for the standard URLs, or set `BACKEND_PORT=5001` when starting development
Compose.

When `package-lock.json` changes, rebuild the development image. If the existing
dependency volume still contains the old package tree, reset development caches:

```bash
npm run docker:dev:reset
```

This removes only this template's development dependency and build-output
volumes. It does not delete source files.

## Deploying to a server

Copy the example configuration and replace the image owner:

```bash
git clone https://github.com/LucUrlings/vue-dotnet-monorepo-template.git
cd vue-dotnet-monorepo-template
cp .env.example .env
docker compose -f docker/compose.server.yml pull
docker compose -f docker/compose.server.yml up -d
```

PowerShell users can replace the copy command with
`Copy-Item .env.example .env`; all root npm commands are shell-independent.

To build production images from the checked-out source:

```bash
docker compose \
  -f docker/compose.server.yml \
  -f docker/compose.build.yml \
  up -d --build
```

`npm run docker:server` uses published images.
`npm run docker:server:build` applies the source-build override.

The normal deployment publishes only Nginx on `FRONTEND_PORT`. Nginx reaches the
API through the private Compose network. For temporary diagnostics only, add
`-f docker/compose.debug.yml` to publish `BACKEND_PORT`.

Public GHCR packages can be pulled anonymously. For private packages:

```bash
printf '%s' "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USER" --password-stdin
```

Supply credentials interactively or through a secret manager—never commit them.
A remote deployment should place a platform-neutral reverse proxy or load
balancer in front of `FRONTEND_PORT` for DNS and HTTPS termination.

## Using this repository as a GitHub template

1. Enable **Template repository** in the repository settings.
2. Select **Use this template** and create a new repository.
3. Clone the new repository.
4. Complete the renaming checklist below.
5. Configure package visibility and Actions permissions.
6. Run `npm run setup`.
7. Start development with `npm run dev`.

## Renaming checklist

- Repository name, root package name, and frontend package name
- README title and workflow badge owner/repository paths
- `VueDotnet.sln`, API/test project names, C# namespaces, and service response
- Docker Compose project name, service/image names, and GHCR paths
- `FRONTEND_IMAGE`, `BACKEND_IMAGE`, and `.env.example` defaults
- License copyright and private vulnerability-reporting settings
- References in `AGENTS.md` and the component READMEs

Search for `VueDotnet`, `vue-dotnet`, `LucUrlings`, and `lucurlings` after
renaming. The publishing workflow derives package names from the generated
repository automatically.

## Commands

| Command                       | Purpose                                                        |
| ----------------------------- | -------------------------------------------------------------- |
| `npm run setup`               | Install locked npm and NuGet dependencies                      |
| `npm run dev`                 | Run Vite and `dotnet watch` together                           |
| `npm run build`               | Build both applications                                        |
| `npm run test`                | Run all frontend and backend tests                             |
| `npm run lint`                | Run ESLint, TypeScript checks, and backend format verification |
| `npm run format`              | Format frontend and backend code                               |
| `npm run format:check`        | Verify formatting without changing files                       |
| `npm run check`               | Run the complete local validation suite                        |
| `npm run docker:dev`          | Start development containers                                   |
| `npm run docker:dev:build`    | Build and start development containers                         |
| `npm run docker:dev:reset`    | Remove development containers and cache volumes                |
| `npm run docker:server`       | Pull and start production images                               |
| `npm run docker:server:build` | Build and start production images from source                  |
| `npm run docker:down`         | Stop both Compose projects                                     |

## API

`GET /api/status` is the frontend-facing integration endpoint:

```json
{
  "status": "ok",
  "service": "VueDotnet.Api",
  "environment": "Development",
  "timestamp": "2026-01-01T12:00:00+00:00"
}
```

The timestamp is generated for each request. `GET /health` is the lightweight
endpoint used by container and external health monitoring. Development OpenAPI
JSON is available at <http://localhost:5000/openapi/v1.json>.

## Configuration

- Root `.env` supplies Compose interpolation; `.env.example` documents defaults
  and keeps development/server Compose project names separate.
- `VITE_PROXY_TARGET` changes the development proxy destination inside Docker.
- Browser API requests always use the relative `/api` contract. Change the Vite
  and Nginx proxy configuration together if a different path is required.
- Backend defaults live in `appsettings.json`; local CORS origins live only in
  `appsettings.Development.json`.
- `ASPNETCORE_ENVIRONMENT`, image names, image tag, and published frontend port
  are configured by environment variables.
- Local development uses ports 5173 and 5000. Production exposes 8080 by default,
  with the API remaining internal.

Use environment variables, Docker secrets, or the deployment platform's secret
manager for production secrets. Images and repository files must not contain
secrets.

## Testing and CI

```bash
npm run test
npm run check
```

`check` verifies repository formatting, then runs frontend type checking,
linting, tests, and production build, followed by backend formatting
verification, tests, and Release build. Pull-request CI mirrors these steps in
separate frontend/backend jobs, audits dependencies, builds both development
and production images, scans production images with Trivy, and smoke-tests the
running production stack. Images are built but never published from pull
requests.

Trivy fails CI for fixable high or critical findings. There are no accepted
exceptions in the base template; any future exception should record the
advisory, rationale, responsible owner, and expiry date.

Every successful push to `main`, including a merged pull request, runs the
publishing workflow after repeating all source, dependency, Compose, and
development-image validation. It publishes the commit SHA and updates `latest`,
so `latest` always identifies the newest successfully published commit on
`main`.

Strict semantic version tags such as `v1.0.0` use the same workflow and also
publish full-version, major/minor, major, commit-SHA, and `latest` tags. A
version tag must point to the current `main` commit; this prevents an older
release from moving `latest` backwards. Manual dispatches require an explicit
image tag and never update `latest`.

All three entry points share this build-once promotion model:

1. Build each component and architecture once and push its untagged platform
   digest.
2. Assemble those digests under the commit-SHA tag.
3. Scan that exact multi-platform digest for amd64 and arm64.
4. Smoke-test the scanned commit-SHA images as a production Compose stack.
5. Promote the applicable release, manual, and stable tags to the scanned
   digest without rebuilding it.

The workflow verifies that every promoted tag resolves to the scanned digest.
If validation, scanning, or smoke testing fails, release and `latest` tags are
unchanged; only content-addressed platform manifests and the commit-SHA
candidate may remain.

## Container packages

The template publishes:

```text
ghcr.io/lucurlings/vue-dotnet-monorepo-template-frontend
ghcr.io/lucurlings/vue-dotnet-monorepo-template-backend
```

Successful `main` builds receive commit-SHA and stable `latest` tags. Version
releases additionally receive full semantic-version, major/minor, and major
tags. Manual dispatches receive the supplied tag and a SHA tag. Pull a release
with:

```bash
docker pull ghcr.io/lucurlings/vue-dotnet-monorepo-template-frontend:1.0.0
docker pull ghcr.io/lucurlings/vue-dotnet-monorepo-template-backend:1.0.0
```

New packages may initially require a maintainer to configure visibility in the
package settings. Once public, GHCR permits anonymous pulls.

## Production deployment

The frontend image builds static Vue assets and serves them with Nginx. Nginx
handles history fallback, cache policy, and `/api` proxying. The .NET API runs as
a non-root user on the internal network. Compose waits for `/health` before
starting Nginx; both services have health checks and restart policies.

Use the container logs as the initial operational signal and collect them with
the host platform as needs grow. The base template has no persistent storage or
database. If one is later introduced, design backups, migrations, volumes, and
credentials as part of that addition.

## Extending the template

Authentication, Entity Framework Core, PostgreSQL, migrations, background jobs,
generated OpenAPI clients, UI libraries, internationalisation, Playwright,
observability, Traefik or Caddy, Kubernetes, and extra backend projects are
intentionally excluded. Add them when product requirements justify the cost.
Choose a separate Nuxt-based template when server-side rendering is required.

## Agent usage

[`AGENTS.md`](AGENTS.md) contains concise working rules for Codex and other tools
that intentionally read repository instructions. Not every AI tool supports
this convention automatically.

## Contributing

Fork the repository, create a focused branch, implement the change, run
`npm run check`, and open a pull request. Use the issue forms for reproducible
bugs and reusable feature proposals, and complete the pull request checklist.

## Security

See [SECURITY.md](SECURITY.md). Do not report vulnerabilities in public issues.

## License

VueDotnet Monorepo is available under the [MIT License](LICENSE).
