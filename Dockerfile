FROM node:24
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.html vite.config.ts tsconfig.json ./
COPY public ./public
COPY src ./src
EXPOSE 3000
CMD ["npm", "start"]
