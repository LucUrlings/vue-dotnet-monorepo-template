# Repository instructions

## Purpose and architecture

This is a generic public Vue and ASP.NET Core template, not a domain-specific
application. `frontend/` contains the Vue client, `backend/` contains the API,
and root npm scripts orchestrate both. `docker/compose.dev.yml` is for
containerized development; `docker/compose.server.yml` is the published-image
deployment, with `docker/compose.build.yml` for source builds.

## Development rules

- Use Vue Composition API, `<script setup lang="ts">`, and strict TypeScript.
- Keep HTTP calls in `frontend/src/api`. Use Pinia only for genuinely shared state.
- Use controllers and typed models in the backend. Prefer built-in .NET features.
- Do not add architectural layers or dependencies without a concrete need.
- Keep Windows, macOS, Linux, and Docker Desktop workflows working.
- Never commit secrets, private certificates, `.env`, or build output.
- Keep the root, frontend, and backend READMEs, environment examples, Docker
  instructions, and workflows aligned whenever commands or configuration change.
- Avoid weather examples, business-specific features, fake abstractions, and
  unrelated refactors.

## Validation

Run the checks most relevant to the change. Before declaring broad repository
work complete, run:

```text
npm run check
docker compose -f docker/compose.server.yml -f docker/compose.build.yml build
```

Report commands and results, checks not run, and assumptions. Docker changes
should also validate Compose configuration and the affected runtime path.
