// Import the necessary dependencies for testing
const { expect } = require("chai");
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const {
  getCrowdfundContractAndAccounts,
  getStartAndFinish,
} = require("./utils");

describe("Vote", async () => {
  it("should be voted if the campaign exists", async () => {
    const { crowdfund } = await loadFixture(getCrowdfundContractAndAccounts);
    const deltaEnd = 100;
    const { startAt, endAt } = await getStartAndFinish(30, deltaEnd);

    // Create a new campaign
    await crowdfund.create(1, startAt, endAt);

    let campaign = await crowdfund.campaigns(1);
    expect(campaign.votes).to.be.equal(0);

    // Vote the campaign
    await crowdfund.connect(voter).voteCampaign(1);

    campaign = await crowdfund.campaigns(1);
    expect(campaign.votes).to.be.equal(1);
  });
  it("should revert when a user tries to vote for a non-existing campaign", async function () {
    const nonExistingCampaignId = 99;

    const { crowdfund, voter } = await loadFixture(
      getCrowdfundContractAndAccounts
    );
    const c = await crowdfund.campaigns(99);
    await expect(
      crowdfund.connect(voter).voteCampaign(nonExistingCampaignId)
    ).to.be.revertedWith("Campaign is not created");
  });

  it("Cannot vote twice", async () => {
    const { crowdfund } = await loadFixture(getCrowdfundContractAndAccounts);
    const deltaEnd = 100;
    const { startAt, endAt } = await getStartAndFinish(30, deltaEnd);

    // Create a new campaign
    await crowdfund.create(1, startAt, endAt);

    let campaign = await crowdfund.campaigns(1);
    expect(campaign.votes).to.be.equal(0);

    // Vote the campaign
    await crowdfund.connect(voter).voteCampaign(1);
    await expect(crowdfund.connect(voter).voteCampaign(1)).to.be.revertedWith(
      "Already voted"
    );
  });
});
