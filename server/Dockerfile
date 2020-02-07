# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:12.15.0-slim

ENV PRODUCTION_DB_URL=""
ENV DEVELOPMENT_DB_URL=""

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package.json yarn.lock ./

# Install production dependencies
RUN yarn

# Copy local code to the container image.
COPY . ./

# Generate ORM engine
RUN yarn generate:prisma

ENTRYPOINT ["sh"]
# Run the web service on container startup.
CMD ["entrypoint.sh"]
