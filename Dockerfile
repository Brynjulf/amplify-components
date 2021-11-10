# Base
FROM node:16 as base
WORKDIR /app
RUN npm install -g serve
COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig*.json ./

# Dependencies
FROM base as dependencies
WORKDIR /app
RUN npm install
COPY src src

# Build and serve
FROM dependencies as builder
WORKDIR /app
RUN yarn run build-storybook
COPY Dockerfile storybook-static
RUN serve storybook-static
