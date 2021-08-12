FROM node:14 as build

ENV NODE_ENV='production'

ENV LISTEN_IP='0.0.0.0'
ENV LISTEN_PORT='80'

RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn --production=false --frozen-lockfile

COPY tsconfig.json /app/
COPY src /app/src

RUN yarn build

FROM node:14-slim as runtime

RUN apt update

ENV NODE_ENV='production'

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn --frozen-lockfile

COPY --from=build /app/dist /app/dist
COPY ormconfig.js /app/ormconfig.js

CMD ["node", "dist/index.js"]
