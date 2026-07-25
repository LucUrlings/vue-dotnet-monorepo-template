# Frontend

The frontend is a Vue 3 single-page application built with Vite and strict
TypeScript. It uses `<script setup lang="ts">`, Vue Router for page navigation,
Pinia for the shared backend connection state, and native `fetch`.

## Architecture

- `src/api/` owns typed HTTP calls. Components do not call `fetch` directly.
- `src/components/` contains reusable presentation components.
- `src/router/` defines the Home and About routes.
- `src/stores/` contains state that is genuinely shared.
- `src/views/` contains route-level views.
- `tests/` contains isolated component, store, API, and router tests.

## Commands

Run these from `frontend/`, or use the root orchestration commands:

```bash
npm ci
npm run dev
npm run type-check
npm run lint
npm run test
npm run test:run
npm run build
npm run format
```

Tests use Vitest, jsdom, and Vue Test Utils. Network requests are mocked, so the
backend is not required.

## API

The status client requests the stable relative path `/api/status`. During local
development, Vite proxies `/api` to `http://localhost:5000`.
`VITE_PROXY_TARGET=http://backend:5000` is supplied by development Compose.

If an application needs a different API path, update the client, Vite proxy, and
Nginx proxy together. Never put secrets in Vite variables: values included in a
frontend build are public.

## Routing and state

Vue Router uses HTML5 history. Production Nginx falls back to `index.html` for
deep links. Pinia stores loading, success, and error state for the backend status
card; page-local state should remain in components. Status requests validate the
runtime JSON contract, time out after eight seconds, and cancel superseded
requests.

## Containers

The `development` Docker target installs dependencies and runs Vite. Compose
mounts the source over `/app` while preserving `/app/node_modules` in a named
volume. Enable `CHOKIDAR_USEPOLLING=true` if Docker Desktop misses file events.
After changing frontend dependencies, use `npm run docker:dev:reset` from the
repository root if an existing modules volume remains stale.

The `production` target builds with `npm ci` and copies only `dist/` into Nginx.
Nginx serves assets, handles router fallback and cache headers, exposes
`/healthz`, and proxies `/api` to the internal backend service.

Build the production image from the repository root:

```bash
docker build -f frontend/Dockerfile --target production -t vue-dotnet-frontend .
```
