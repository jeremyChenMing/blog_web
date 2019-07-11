# build stage
ARG BASE
FROM $BASE as build-env
COPY . /usr/src/www/

RUN npm run build

# final stage
FROM nginx:1.13
COPY --from=build-env /usr/src/www/dist /opt/www
