FROM node:16 AS build

RUN apt update

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# RUN apt install openssl

FROM nginx:alpine

COPY --from=build /app/static/ /usr/share/nginx/html

COPY ./default.conf /etc/nginx/default.conf

EXPOSE 443

# RUN mkdir -p ./certs

# RUN openssl req -newkey rsa:2048 -nodes -keyout ./certs/selfsigned.key -x509 -out ./certs/selfsigned.crt -days 365

CMD ["nginx", "-g", "daemon off;"]
