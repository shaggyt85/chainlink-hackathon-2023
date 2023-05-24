// Import the necessary dependencies for testing
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const {
  getCrowdfundContractAndAccounts,
  getStartAndFinish,
  ZERO_ACCOUNT,
} = require("./utils");

describe("Campaigns", async () => {
  it("should create a new campaign", async () => {
    // Create a new campaign

    const { crowdfund } = await loadFixture(getCrowdfundContractAndAccounts);

    const { startAt, endAt } = await getStartAndFinish();
    const createTx = await crowdfund.create(1, startAt, endAt);
    await createTx.wait();

    // Retrieve the created campaign details

    const campaign = await crowdfund.campaigns(1);

    // Verify the campaign details

    expect(campaign.goals).to.equal(1);
    expect(campaign.startAt).to.equal(startAt);
    expect(campaign.endAt).to.equal(endAt);
  });

  it("should cancel a campaign", async () => {
    // Create a new campaign

    const { crowdfund, owner } = await loadFixture(
      getCrowdfundContractAndAccounts
    );
    const { startAt, endAt } = await getStartAndFinish();

    await crowdfund.create(1, startAt, endAt);

    let campaign = await crowdfund.campaigns(1);

    expect(campaign.creator).to.equal(owner.address);

    // Cancel the campaign

    const cancelTx = await crowdfund.cancel(1);
    await cancelTx.wait();

    // Retrieve the canceled campaign details

    campaign = await crowdfund.campaigns(1);

    // Verify the campaign creator

    expect(campaign.creator).to.equal(ZERO_ACCOUNT);
  });

  it("should add goals to a campaign", async () => {
    // Create a new campaign
    const { crowdfund } = await loadFixture(getCrowdfundContractAndAccounts);

    const { startAt, endAt } = await getStartAndFinish();

    await crowdfund.create(2, startAt, endAt);

    // Add goals to the campaign
    const addGoalsTx = await crowdfund.addGoals(1, [
      {
        id: 1,
        price: 100,
      },
      {
        id: 2,
        price: 200,
      },
    ]);
    await addGoalsTx.wait();

    // Retrieve the campaign goals
    const goals = await crowdfund.getGoals(1);

    // // Verify the campaign goals
    expect(goals).to.have.lengthOf(2);
    expect(goals[0].id).to.equal(1);
    expect(goals[0].price).to.equal(100);
    expect(goals[1].id).to.equal(2);
    expect(goals[1].price).to.equal(200);
  });
});
