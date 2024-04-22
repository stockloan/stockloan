FROM node:16-alpine

RUN apk add --no-cache git

ENV PORT 3000

WORKDIR /home/stock/stockloan

COPY package*.json yarn.lock .env* ./

RUN yarn install

COPY ./ ./

ENV NODE_ENV production

RUN yarn build

CMD ["yarn", "start"]