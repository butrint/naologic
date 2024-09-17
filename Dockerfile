FROM --platform=linux/amd64 node:lts-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["node", "/app/dist/main"]