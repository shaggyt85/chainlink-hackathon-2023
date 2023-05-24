// Import the necessary dependencies for testing
const { expect } = require("chai");
const {
  loadFixture,
  time,
} = require("@nomicfoundation/hardhat-network-helpers");
const { getCrowdfundContractAndAccounts } = require("./utils");

describe("Pause", () => {
  it("should pause and unpause the contract correctly", async () => {
    const { crowdfund } = await loadFixture(getCrowdfundContractAndAccounts);
    const timestamp = await time.latest();
    const startTime = timestamp + 3600;
    const finishTime = timestamp + 7200;

    // Pause the contract
    await crowdfund.pause();

    // Try to create a new campaign (should fail due to pause)
    await expect(crowdfund.create(1, startTime, finishTime)).to.be.revertedWith(
      "Pausable: paused"
    );

    // Unpause the contract
    await crowdfund.unpause();

    // Create a new campaign (should succeed after unpause)

    const createTx = await crowdfund.create(1, startTime, finishTime);
    await createTx.wait();
  });
});
