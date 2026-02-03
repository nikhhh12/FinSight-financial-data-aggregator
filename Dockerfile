# =========================
# Base image (latest LTS)
# =========================
FROM node:22-alpine AS base

WORKDIR /app

# Prevent telemetry & ensure consistent installs
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# =========================
# Dependencies stage
# =========================
FROM base AS deps

# Install libc compatibility (needed for some native deps)
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

# =========================
# Build stage
# =========================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js app
RUN npm run build

# =========================
# Production runtime stage
# =========================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Create non-root user (security best practice)
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy required files only
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

# If you use Prisma / DB migrations
# COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]
