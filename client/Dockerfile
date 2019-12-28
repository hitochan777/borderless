FROM node:12.14.0-alpine3.11 AS builder
WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
RUN yarn build && yarn --production

FROM node:12.14.0-alpine3.11
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["yarn", "start"]
