# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application code from the builder stage
COPY --from=builder /app ./

# Secure the container with a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 8080
# Replace index.js with your actual entry file (e.g., server.js or app.js)
CMD ["node", "index.js"]