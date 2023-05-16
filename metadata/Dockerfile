FROM node:16-alpine
WORKDIR /app
RUN npm install -g json-server
COPY db.json /app/
EXPOSE 3000
CMD [ "json-server", "--watch", "db.json",  "--port", "3000", "--host", "0.0.0.0"]