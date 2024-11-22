mkdir -p /etc/nginx/certs/

openssl req -x509 -newkey rsa:4096 -days 20 -nodes -keyout /etc/nginx/certs/selfsigned.key -out /etc/nginx/certs/selfsigned.crt -subj "/C=MA/L=AG/O=ME/OU=ME/CN=www.airtrail.com"

nginx -g "daemon off;"
