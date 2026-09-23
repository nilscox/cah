FROM ghcr.io/pnpm/pnpm:12.5.1 AS base
RUN pnpm runtime set node 24.21.0 -g

COPY pnpm-lock.yaml pnpm-workspace.yaml .
RUN pnpm fetch --prod

COPY . /app
WORKDIR /app
RUN pnpm install --prod --offline --frozen-lockfile

EXPOSE 3000
CMD pnpm run --filter @cah/server start
