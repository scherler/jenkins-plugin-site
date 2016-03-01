FROM node:slim

RUN mkdir /plugins
COPY ./index.html /plugins/
COPY ./.babelrc /plugins/
COPY ./package.json /plugins/
COPY ./css/ /plugins/css/
COPY ./webpack.commons.js /plugins/
COPY ./webpack.config.docker.js /plugins/
COPY ./server/ /plugins/server/
COPY ./app/ /plugins/app/
COPY ./node_modules/ /plugins/node_modules/
WORKDIR /plugins

CMD npm run docker

EXPOSE 5000
