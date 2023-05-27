const { time } = require("@nomicfoundation/hardhat-network-helpers");

const ZERO_ACCOUNT = "0x0000000000000000000000000000000000000000";
const TOKEN_DECIMALS = "18";

async function getStartAndFinish(deltaStart = 3600, deltaFinish = 72000) {
  const timestamp = await time.latest();
  const startAt = timestamp + deltaStart;
  const endAt = timestamp + deltaFinish;
  return { startAt, endAt };
}

async function getCrowdfundContractAndAccounts() {
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const mockERC20 = await MockERC20.deploy();

  const MockAggregator = await hre.ethers.getContractFactory("MockAggregator");
  const mockAggregator = await MockAggregator.deploy();

  const minVotes = 1;
  const maxDuration = 10 * 7 * 24 * 60 * 60;

  const Crowdfund = await hre.ethers.getContractFactory("CrowdFund");
  const crowdfund = await Crowdfund.deploy(
    mockERC20.address,
    maxDuration,
    minVotes,
    mockAggregator.address
  );

  await crowdfund.deployed();

  // Get signers
  [owner, voter, validator, user] = await ethers.getSigners();

  // Transfer tokens and increase allowance
  const amount = ethers.utils.parseUnits("1000", TOKEN_DECIMALS);
  await mockERC20.transfer(user.getAddress(), amount);
  await mockERC20.connect(user).increaseAllowance(crowdfund.address, amount);

  // Assign roles to the respective signers
  await crowdfund.grantVoterRole(voter.address);
  await crowdfund.grantValidatorRole(validator.address);

  return { crowdfund, owner, voter, validator, user };
}

module.exports = {
  getCrowdfundContractAndAccounts,
  ZERO_ACCOUNT,
  TOKEN_DECIMALS,
  getStartAndFinish,
};
