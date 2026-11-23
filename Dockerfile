# Local image for the STEPS-Tutor API.
# Build: docker build -t steps-tutor-api:local .
# Run:   docker run --rm -p 3001:3001 --env-file .env steps-tutor-api:local

FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.docker.json ./
COPY src ./src

# Path aliases (@common, @modules) stay in the emitted JavaScript and are
# resolved at runtime with tsconfig-paths.
RUN ./node_modules/.bin/tsc -p tsconfig.docker.json --pretty false

FROM node:22-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY tsconfig.runtime.json ./tsconfig.json

USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "const port=process.env.PORT||3001; fetch('http://127.0.0.1:'+port+'/api').then((res)=>process.exit(res.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
