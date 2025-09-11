# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS base
ENV NODE_ENV=production
WORKDIR /app

# --- deps (full for build) ---
FROM base AS deps
COPY package.json ./
COPY apps/web/package.json ./apps/web/package.json
RUN npm -v && node -v && npm i -g npm@latest
RUN npm ci --workspace apps/web --include-workspace-root=false --no-audit --no-fund

# --- build app ---
FROM deps AS build
COPY apps/web ./apps/web
WORKDIR /app/apps/web
RUN npm run build

# --- prod deps only ---
FROM base AS prod-deps
COPY package.json ./
COPY apps/web/package.json ./apps/web/package.json
RUN npm ci --omit=dev --workspace apps/web --include-workspace-root=false --no-audit --no-fund

# --- runtime ---
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app
RUN addgroup -S nodejs && adduser -S node -G nodejs

# Copy runtime deps + build output only
COPY --from=prod-deps /app/apps/web/node_modules ./node_modules
COPY --from=build /app/apps/web/build ./build

USER node
EXPOSE 8080
CMD ["node", "build"]

