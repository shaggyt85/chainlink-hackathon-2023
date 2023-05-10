// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const initialSupply = 800000000000000;

  const FYSPToken = await hre.ethers.getContractFactory("FYSPToken");
  const token = await FYSPToken.deploy(initialSupply);

  const minVotes = 10;
  const maxDuration = 10 * 7 * 24 * 60 * 60;

  const Crowdfund = await hre.ethers.getContractFactory("CrowdFund");
  const crowdfund = await Crowdfund.deploy(
    token.address,
    maxDuration,
    minVotes
  );

  await crowdfund.deployed();

  console.log(`Crowdfund deployed to ${crowdfund.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
