FROM node:24
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.html vite.config.ts tsconfig.json playwright.config.ts ./
COPY public ./public
COPY src ./src
RUN npm run test:run

COPY e2e ./e2e
RUN npx playwright install --with-deps
RUN npm run test:e2e

EXPOSE 3000
CMD ["npm", "start"]
