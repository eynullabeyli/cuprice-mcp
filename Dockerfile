FROM node:24-bookworm-slim AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS builder
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc

FROM base AS runner
ENV PORT=5000
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund
COPY --from=builder /app/dist ./dist
COPY public ./public

EXPOSE 5000
CMD ["node", "dist/src/server.js"]
