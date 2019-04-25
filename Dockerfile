FROM node:10.15.3-alpine

ENV user node
WORKDIR /opt/app

COPY ./package.json /opt/app/package.json
COPY ./yarn.lock /opt/app/yarn.lock
RUN chown $user -R /opt/app
USER $user
RUN yarn

COPY ./ /opt/app
USER $user
RUN yarn build

ENTRYPOINT ["yarn"]
CMD ["start"]