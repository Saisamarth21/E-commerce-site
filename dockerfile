# Docker File

# Base image compatible with ARM architecture

FROM node:20-slim

# Set working directory

WORKDIR /app

# Copy package.json and package-lock.json files

COPY package*.json ./

# Install dependencies

RUN npm install

# Copy the rest of the application (including .env files)

COPY . .

# Build the application

RUN npm run build

# Install serve to host the application

RUN npm install -g serve

# Expose port 2000

EXPOSE 2000

# Start the application without the host option

CMD ["serve", "-s", "dist", "-l", "2000"]