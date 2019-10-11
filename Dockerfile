#### GATHER DEPENDENCIES ####
FROM	node:latest as build

WORKDIR /usr/local/tepid/
COPY    ./ /usr/local/tepid/
RUN	npm update
RUN	npm install -g npm
RUN	npm install -g

#### BUILD ####
ARG	REACT_APP_WEB_URL_PRODUCTION=$REACT_APP_WEB_URL_PRODUCTION
RUN	npm run build

#### DEPLOY ####

FROM	nginx:latest
COPY	nginx.conf /etc/nginx/conf.d/default.conf
COPY	--from=build /usr/local/tepid/build /usr/share/nginx/html
