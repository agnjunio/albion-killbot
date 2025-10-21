FROM node:16-alpine AS build
WORKDIR /app

# Install project dependencies
COPY package*.json ./
RUN npm ci

# Copy all files except those listed in .dockerignore
COPY . .

CMD [ "npm", "start"]
