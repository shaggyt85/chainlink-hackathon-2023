FROM node:16-bullseye-slim
WORKDIR /app
COPY . /app
RUN npm install
RUN npx hardhat compile
EXPOSE 8545
CMD [ "npx", "hardhat", "node", "--hostname", "0.0.0.0"]