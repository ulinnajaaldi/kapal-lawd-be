# Build stage
FROM node:20-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies for building)
RUN pnpm install --frozen-lockfile

# Copy source code and configuration files
COPY src/ ./src/
COPY tsconfig.json tsconfig.build.json nest-cli.json ./

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# Install pnpm globally
RUN npm install -g pnpm

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership to non-root user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3005

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:3005/api/v1', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); });"

# Start the application
CMD ["node", "dist/main"]
