FROM node:12 as build-deps
WORKDIR /usr/src/app
COPY package.json src ./
RUN npm install

COPY . ./
RUN npm run build

FROM nginx:1.19.6
COPY --from=build-deps /usr/src/app/cyberoon usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]
