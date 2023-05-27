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
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    docker: {
      chainId: 31337,
      url: "http://blockchain:8545",
    },
    sepolia: {
      chainId: 11155111,
      url: "https://eth-sepolia.public.blastapi.io",
      accounts: [process.env.PRIVATE_KEY],
    },
    goerli: {
      chainId: 5,
      url: "https://goerli.blockpi.network/v1/rpc/public",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
