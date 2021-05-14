FROM node:12
VOLUME /golem/input /golem/output /golem/resources
COPY package*.json finder.js /golem/work/
WORKDIR /golem/work
RUN npm install