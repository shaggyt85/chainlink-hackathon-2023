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

describe("Gets", async () => {
  it("Get the campaings", async () => {
    const { crowdfund, owner } = await loadFixture(
      getCrowdfundContractAndAccounts
    );
    const deltaEnd = 100;
    const { startAt, endAt } = await getStartAndFinish(30, deltaEnd);

    // No campaigns by default
    const noCampaigns = await crowdfund.getCampaigns();
    expect(noCampaigns).to.be.an("array").that.is.empty;

    // Create a new campaign
    await crowdfund.create(1, startAt, endAt);
    await crowdfund.create(1, startAt, endAt);

    // Vote the campaign
    await crowdfund.connect(voter).voteCampaign(1);
    await crowdfund.connect(voter).voteCampaign(2);

    // Add goals to the campaign
    const addGoalsTx = await crowdfund.addGoals(1, [
      {
        id: 1,
        price: 100,
      },
    ]);
    await addGoalsTx.wait();

    // Start the campaign
    await time.increase(30);

    await expect(crowdfund.updateCampaigns()).to.emit(
      crowdfund,
      "CampaignUpdated"
    );

    const campaigns = await crowdfund.getCampaigns();
    expect(campaigns).to.be.an("array").that.is.not.empty;
    expect(campaigns.length).to.be.equal(2);

    expect(campaigns[0].creator).to.be.equal(owner.address);
    expect(campaigns[0].status).to.be.equal(3);

    expect(campaigns[1].creator).to.be.equal(owner.address);
    expect(campaigns[1].status).to.be.equal(1);
  });
  it("Get the goals", async () => {
    const { crowdfund } = await loadFixture(getCrowdfundContractAndAccounts);
    const deltaEnd = 100;
    const { startAt, endAt } = await getStartAndFinish(30, deltaEnd);

    // No campaigns by default
    const noGoals = await crowdfund.getGoals(0);
    expect(noGoals).to.be.an("array").that.is.empty;

    // Create a new campaign
    await crowdfund.create(1, startAt, endAt);

    // Vote the campaign
    await crowdfund.connect(voter).voteCampaign(1);

    // Add goals to the campaign
    const addGoalsTx = await crowdfund.addGoals(1, [
      {
        id: 1,
        price: 100,
      },
    ]);
    await addGoalsTx.wait();

    // Start the campaign
    await time.increase(30);

    await expect(crowdfund.updateCampaigns()).to.emit(
      crowdfund,
      "CampaignUpdated"
    );

    const goals = await crowdfund.getGoals(1);
    expect(goals).to.be.an("array").that.is.not.empty;
    expect(goals.length).to.be.equal(1);

    expect(goals[0].id).to.be.equal(1);
    expect(goals[0].price).to.be.equal(100);
    expect(goals[0].status).to.be.equal(0);
    expect(goals[0].proof).to.be.equal("");
  });
});
