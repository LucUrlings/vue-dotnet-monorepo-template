# Backend

The backend is a lightweight .NET 10 solution:

```text
VueDotnet.sln
├── VueDotnet.Api
└── VueDotnet.Api.Tests
```

The API uses controllers, typed response models, built-in dependency injection,
OpenAPI, CORS, and health checks. It intentionally has no persistence or extra
architectural layers.

## Run and test

From the repository root:

```bash
dotnet restore backend/VueDotnet.sln --locked-mode
dotnet run --project backend/VueDotnet.Api
dotnet test backend/VueDotnet.sln
dotnet format backend/VueDotnet.sln --verify-no-changes
```

The development profile listens on `http://localhost:5000`. Root `npm run dev`
also fixes this port explicitly.

## Endpoints and configuration

- `GET /api/status` returns a typed service, environment, and UTC timestamp.
- `GET /health` is the lightweight health endpoint.
- `/openapi/v1.json` is mapped only in the Development environment.

Base configuration is in `appsettings.json`. Development logging and the single
allowed CORS origin (`http://localhost:5173`) are in
`appsettings.Development.json`. The normal browser path uses the Vite proxy and
does not require CORS. Production has no unrestricted CORS policy.

Add services directly to the built-in dependency injection container. Keep API
contracts in `Models/` and HTTP behavior in controllers.

## Testing

The xUnit project includes a direct controller test and
`WebApplicationFactory<Program>` integration tests. Tests verify the typed
status response, JSON media type, timestamp, environment, `/health`,
development-only OpenAPI, and the configured development CORS origin.

## Containers

The development target uses the .NET SDK and Compose runs `dotnet watch` with a
source mount and polling enabled. Named volumes isolate container `bin/obj`
output from host SDK output. The production build restores, builds, and
publishes in SDK stages, then copies output into the supported .NET 10 Ubuntu
runtime image. Microsoft does not ship Debian images for .NET 10; Ubuntu keeps
glibc behavior without Alpine's native/globalisation differences. The API runs
as the image's non-root `app` user on internal port 8080.

Build from the repository root:

```bash
docker build \
  -f backend/VueDotnet.Api/Dockerfile \
  --target production \
  -t vue-dotnet-backend .
```

## Growing the backend

Add another backend project only when the application has a concrete boundary
that benefits from it. Authentication, persistence, migrations, background
jobs, and application/domain layers should arrive with their requirements—not
as speculative code in the starter.
