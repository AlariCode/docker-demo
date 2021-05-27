FROM node:14-alpine as build
WORKDIR /opt/app
ADD *.json ./
RUN npm install
RUN npm i webpack
ADD . .
RUN npm run build api
RUN npm prune --production
CMD [ "node", "./dist/apps/api/main.js" ]