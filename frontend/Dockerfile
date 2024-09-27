FROM node:22-alpine AS node

WORKDIR /app
COPY ./package.json  ./yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --frozen-lockfile

COPY . .
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn run build

RUN yarn run build

FROM caddy:alpine
WORKDIR /www
COPY ./caddy /caddy

COPY --from=node /app/dist/ ./

RUN chmod -R +x /www

ENTRYPOINT caddy run -c /caddy/Caddyfile

