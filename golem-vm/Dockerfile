FROM node:12
VOLUME /golem/input /golem/output /golem/resources
COPY package*.json hello.js starter.sh /golem/work/
WORKDIR /golem/work
RUN npm install