require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10_000_000,
      },
    },
  },
  allowUnlimitedContractSize: true,
  networks: {
    docker: {
      chainId: 31337,
      url: "http://blockchain:8545",
    },
    goerli: {
      chainId: 5,
      url: "https://rpc.ankr.com/eth_goerli",
    },
  },
};
