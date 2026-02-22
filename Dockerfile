# =============================================================================
# Zynvo Backend - Production Dockerfile
# Multi-stage build optimized for security, size, and reliability
# =============================================================================

# --- Stage 1: Dependencies ---
FROM node:22-slim AS deps

WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy package files for caching
COPY package.json package-lock.json* ./

# Install ALL dependencies (need devDeps for build)
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# --- Stage 2: Builder ---
FROM node:22-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

# Copy source files
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY openapispecfile.json ./openapispecfile.json

# Generate Prisma client (use schema directly, bypass prisma.config.ts to avoid ESM issues)
RUN npx prisma generate --schema=prisma/schema.prisma

# Build TypeScript
RUN npm run build

# Prune devDependencies for smaller runtime image
RUN npm prune --production

# --- Stage 3: Production Runtime ---
FROM node:22-slim AS runtime

# Labels for container metadata
LABEL org.opencontainers.image.source="https://github.com/DSuper03/zynvo-backend"
LABEL org.opencontainers.image.description="Zynvo Backend API"
LABEL maintainer="DSuper03"

WORKDIR /app

# Install runtime dependencies only
# - openssl: Required by Prisma
# - dumb-init: Proper signal handling for graceful shutdown
# - curl: Health check
RUN apt-get update && apt-get install -y --no-install-recommends openssl dumb-init curl && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs zynvo

# Set environment
# PORT is set by Cloud Run at runtime; 8000 is the fallback default
ENV NODE_ENV=production


# Copy only production artifacts
COPY --from=builder --chown=zynvo:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=zynvo:nodejs /app/dist ./dist
COPY --from=builder --chown=zynvo:nodejs /app/prisma ./prisma
COPY --from=builder --chown=zynvo:nodejs /app/openapispecfile.json ./openapispecfile.json
COPY --chown=zynvo:nodejs package.json ./

# Switch to non-root user
USER zynvo

# Expose port
EXPOSE 8000

# Health check - adjust endpoint as needed
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Use dumb-init for proper signal handling (graceful shutdown)
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "--max-old-space-size=512", "dist/index.js"]
