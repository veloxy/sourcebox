FROM veloxy/nginx-production

MAINTAINER Kevin Vandenborne <kevin.vandenborne@gmail.com>

ADD build /app/

EXPOSE 80 443