# Estágio de construção
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Estágio de produção
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/app.js"]