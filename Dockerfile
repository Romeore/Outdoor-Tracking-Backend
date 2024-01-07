# Stage 1 
FROM node:lts
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . . 
RUN yarn build 
EXPOSE 3001
ENTRYPOINT [ "yarn", "start" ]