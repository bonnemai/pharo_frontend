FROM node:24 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.html vite.config.ts tsconfig.json playwright.config.ts ./
COPY public ./public
COPY src ./src
COPY e2e ./e2e
RUN npx playwright install --with-deps
RUN npm run test:run
RUN npm run test:e2e
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
