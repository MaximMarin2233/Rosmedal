FROM nginx:1.24.0-alpine

RUN apk update && apk add apache2-utils

COPY ./ /etc/nginx/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]