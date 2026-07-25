# syntax=docker/dockerfile:1.7
FROM mcr.microsoft.com/dotnet/sdk:10.0-noble@sha256:ed034a8bf0b24ded0cbbac07e17825d8e9ebfe21e308191d0f7421eaf5ad4664 AS development
WORKDIR /workspace

COPY backend/VueDotnet.sln backend/
COPY backend/VueDotnet.Api/VueDotnet.Api.csproj backend/VueDotnet.Api/
COPY backend/VueDotnet.Api.Tests/VueDotnet.Api.Tests.csproj backend/VueDotnet.Api.Tests/
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet restore backend/VueDotnet.sln --locked-mode
COPY backend/ backend/

EXPOSE 5000
CMD ["dotnet", "watch", "--project", "backend/VueDotnet.Api/VueDotnet.Api.csproj", "--urls", "http://0.0.0.0:5000"]

FROM development AS build
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet build backend/VueDotnet.Api/VueDotnet.Api.csproj \
    --configuration Release \
    --no-restore

FROM build AS publish
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet publish backend/VueDotnet.Api/VueDotnet.Api.csproj \
    --configuration Release \
    --no-build \
    --output /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0-noble@sha256:1fa23fc4872d95fd71c2833ebe65d7e84a43b2d51a31d119516852f13d9505a7 AS production
WORKDIR /app
COPY --from=publish /app/publish ./

ENV ASPNETCORE_HTTP_PORTS=8080 \
    ASPNETCORE_ENVIRONMENT=Production \
    HEALTHCHECK_URL=http://127.0.0.1:8080/health

USER app
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD ["dotnet", "VueDotnet.Api.dll", "--healthcheck"]
ENTRYPOINT ["dotnet", "VueDotnet.Api.dll"]
