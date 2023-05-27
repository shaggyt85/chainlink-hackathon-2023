# Fund your social project

TODO

## Production

## Testnet

Currenly we're using Goerli testnet:

- MockERC20 deployed to 0xa12450d42dcb0c64fE5d6c59D01eA19e6213B2e6
- Crowdfund deployed to 0xA2E281aE8E4c56e7AE328086D0B8D4E2bE3fa5D0
- Chainlink automation https://automation.chain.link/goerli/40014270112186586710872972971551308496725179069292283278035680608805269185661

### Verification

´´´npx hardhat verify --network goerli --contract contracts/Crowdfund.sol:CrowdFund 0xA2E281aE8E4c56e7AE328086D0B8D4E2bE3fa5D0 0xa12450d42dcb0c64fE5d6c59D01eA19e6213B2e6 6048000 1 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e´´´

## Local

### Requirements

- Docker
- Docker compose

### Start the components

To run the project locally you should use Docker compose. Once installed, build and run the containers using the command:

```
docker-compose up
```

or

```
docker-compose up --build
```

if you want to rebuild the projects.

To watch the containers use the command

```
docker ps
```

### Components

#### Aggregator

This service collects the items and prices for verified markets. It should be available at `localhost:5000/products`. You can also get a specific product price using `localhost:5000/products/id`

#### Smart Contract

It will run in the local blockchain in the container called `blockchain`. It should be available at `0.0.0.0:8545` (the chain id is 31337). Check the contract address in the output of the `bootstrap` container:

`bootstrap   | Crowdfund deployed to 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 `

#### Metadata

This service will save the metadata for the campaign (name, description, etc). To create a new entry send a POST to `localhost:4000/campaigns`, a GET to `localhost:4000/campaigns` to get all the campaigns or `localhost:4000/campaigns/<id>` to get just one campaign. The body in the post can be any body because it's a mock API.
