FROM node:12.17.0-alpine3.11
ARG GRAPHQL_ENDPOINT=""
WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
RUN yarn build && yarn --production
EXPOSE 3000
CMD ["yarn", "start"]
