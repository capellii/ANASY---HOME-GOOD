# Dockerfile para ANASY Backend
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY dist ./dist
COPY .env ./.env

EXPOSE 3000

CMD ["node", "dist/app.js"]
