FROM node:24 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.html vite.config.ts tsconfig.json playwright.config.ts ./
COPY src ./src
COPY e2e ./e2e

FROM base AS unit-tests
RUN npm run test:run

FROM unit-tests AS build
RUN npm run build

FROM base AS e2e
RUN npx playwright install --with-deps
RUN npm run test:e2e

FROM nginx:alpine AS runtime
RUN apk add --no-cache curl
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD curl -f http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
