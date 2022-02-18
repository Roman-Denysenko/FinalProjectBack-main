FROM node
WORKDIR /app
VOLUME ["/app/vol"]
COPY package.json ./
COPY swagger.yaml ./
RUN npm install
COPY src/ ./src/
EXPOSE 3001
CMD [ "node", "./src/app.js" ]
