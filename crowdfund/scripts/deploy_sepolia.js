// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const mockERC20 = await MockERC20.deploy();

  const minVotes = 1;
  const maxDuration = 10 * 7 * 24 * 60 * 60;

  const Crowdfund = await hre.ethers.getContractFactory("CrowdFund");
  const crowdfund = await Crowdfund.deploy(
    mockERC20.address,
    maxDuration,
    minVotes,
    "0x694AA1769357215DE4FAC081bf1f309aDC325306" // Sepolia ETH-USD https://docs.chain.link/data-feeds/price-feeds/addresses/
  );

  await crowdfund.deployed();

  console.log(`MockERC20 deployed to ${mockERC20.address}`);

  console.log(`Crowdfund deployed to ${crowdfund.address}.`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
