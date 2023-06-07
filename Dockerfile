FROM node:18-alpine

WORKDIR /usr/src/app

ENV NODE_ENV development

COPY ./ ./

RUN npm install

CMD ["node", "dist/index.js"]
