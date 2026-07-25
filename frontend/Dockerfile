# syntax=docker/dockerfile:1.7
FROM node:26-alpine@sha256:e88a35be04478413b7c71c455cd9865de9b9360e1f43456be5951032d7ac1a66 AS development
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY frontend/ ./

EXPOSE 5173
CMD ["npm", "run", "dev"]

FROM development AS build
RUN npm run build

FROM nginx:stable-alpine3.24@sha256:97d490c12ba55b4946b01546d1c3ed324e8d41ab1c9fcb2a616aa470620e5b46 AS production
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY frontend/nginx-security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/healthz || exit 1
