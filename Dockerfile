FROM node:21-alpine
EXPOSE 8080
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
CMD [ "node", "start:prod" ]