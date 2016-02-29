FROM node:slim

RUN mkdir /plugins
COPY ./.babelrc /plugins/
COPY ./package.json /plugins/
COPY ./server/ /plugins/server/
COPY ./node_modules/ /plugins/node_modules/
COPY ./webpack.commons.js /plugins/
COPY ./webpack.config.docker.js /plugins/
COPY ./index.html /plugins/
COPY ./app/ /plugins/app/
COPY ./css/ /plugins/css/
WORKDIR /plugins

CMD cd /plugins;npm run docker

EXPOSE 5000
