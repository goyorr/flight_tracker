FROM node:16 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

RUN apk update \
    && apk add openssl

COPY --from=build /app/static/ /usr/share/nginx/html

COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 443

COPY start.sh /

RUN chmod +x /start.sh 

CMD ["/start.sh"]
