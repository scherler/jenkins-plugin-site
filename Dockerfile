FROM node:slim

RUN mkdir /plugins
COPY ./.babelrc /plugins/
COPY ./package.json /plugins/
COPY ./server.js /plugins/
COPY ./server/ /plugins/server/
COPY ./webpack.commons.js /plugins/
COPY ./webpack.config.docker.js /plugins/
COPY ./index.html /plugins/
COPY ./app/ /plugins/app/
COPY ./css/ /plugins/css/
WORKDIR /plugins

RUN npm install
CMD cd /plugins; npm run integrity; npm run docker

EXPOSE 5000
