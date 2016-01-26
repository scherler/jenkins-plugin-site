FROM node:slim

RUN mkdir /pepito
COPY ./.babelrc /pepito/
COPY ./package.json /pepito/
COPY ./server.js /pepito/
COPY ./webpack.config.js /pepito/
COPY ./webpack.config.production.js /pepito/
COPY ./index.html /pepito/
WORKDIR /pepito

EXPOSE 5000

RUN npm install
CMD cd /pepito; npm start
COPY ./scripts /pepito/scripts
