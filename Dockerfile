FROM node:16-alpine

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

EXPOSE 7545

CMD ["npm", "run", "dev"]