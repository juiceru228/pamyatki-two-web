FROM postgres
COPY ./server/database/database.sql ./docker-entrypoint-initdb.d/

FROM node:20.12.1

WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY . .
CMD ["npm", "run", "dev"]
