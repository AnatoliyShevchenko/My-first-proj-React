FROM node:18.16

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --no-package-lock

COPY . .

RUN npm run build

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start"]
