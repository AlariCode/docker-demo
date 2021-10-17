
FROM node:14-alpine
WORKDIR /OPT/APP
ADD *.json .
RUN npm install
ADD . .
RUN npm run build api
CMD ["node",".dist/apps/api/main.js"]
