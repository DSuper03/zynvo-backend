# Multi-stage build for Zynvo backend

# --- Builder stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install OS deps if needed (openssl, etc.)
RUN apk add --no-cache openssl

# Copy only package metadata first for better caching
COPY package.json package-lock.json* bun.lockb* ./

# Install dependencies (includes devDeps for TypeScript & Prisma CLI)
RUN npm ci

# Copy the rest of the source
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY openapispecfile.json ./openapispecfile.json

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript to JavaScript
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    PORT=8000

# Copy node_modules and built assets from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/openapispecfile.json ./openapispecfile.json
COPY package.json ./package.json

# Expose application port
EXPOSE 8000

# Default command
CMD ["node", "dist/index.js"]
