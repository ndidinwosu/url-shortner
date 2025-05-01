# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Define a build argument
ARG WEBRISK_API_KEY
ARG API_URL

ENV VITE_WEBRISK_API_KEY=$WEBRISK_API_KEY
ENV VITE_API_URL=$API_URL

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set Nginx to listen on Cloud Run’s expected port
RUN sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Expose port 8080 (instead of 80)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]