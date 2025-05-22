FROM crypto-web-mobile/base
COPY . ./opt/app

COPY ./production-conf/. ./opt/app/

RUN cd /opt/app && npm i pm2
# Если вы создаете сборку для продакшн
# RUN npm ci --only=production
WORKDIR /opt/app
RUN cd /opt/app && yarn run build

EXPOSE 3000
ENTRYPOINT ["yarn","run","start"]

