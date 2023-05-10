require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  allowUnlimitedContractSize: true,
  networks: {
    docker: {
      chainId: 31337,
      url: "http://blockchain:8545",
    },
  },
};
