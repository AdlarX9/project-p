#!bin/sh
envsubst < /usr/local/project-p/reverse-proxy/nginx.conf > /etc/nginx/conf.d/nginx.conf
exec nginx -g 'daemon off;'
