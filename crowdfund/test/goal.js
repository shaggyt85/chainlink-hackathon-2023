// Import the necessary dependencies for testing
const { expect } = require("chai");
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const {
  getCrowdfundContractAndAccounts,
  getStartAndFinish,
  TOKEN_DECIMALS,
} = require("./utils");

describe("Goal", async () => {
  it("can claim the goal", async () => {
    const { crowdfund, voter, user } = await loadFixture(
      getCrowdfundContractAndAccounts
    );
    const { startAt, endAt } = await getStartAndFinish((deltaStart = 10));

    // Create a new campaign
    await crowdfund.create(1, startAt, endAt);

    // Vote the campaign
    await crowdfund.connect(voter).voteCampaign(1);

    // Add goals to the campaign
    const addGoalsTx = await crowdfund.addGoals(1, [
      {
        id: 0,
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

    // Pledge to the campaign
    const pledgeTokens = ethers.utils.parseUnits("100", TOKEN_DECIMALS);
    const pledgeTx = await crowdfund.connect(user).pledge(1, pledgeTokens);
    await pledgeTx.wait();

    // Retrieve the campaign details
    await expect(crowdfund.claimGoal(1, 0)).to.emit(crowdfund, "GoalClaimed");
  });
  it("can attach proof and validate proof", async () => {
    const { crowdfund, voter, user, validator } = await loadFixture(
      getCrowdfundContractAndAccounts
    );
    const { startAt, endAt } = await getStartAndFinish((deltaStart = 10));

    // Create a new campaign
    await crowdfund.create(1, startAt, endAt);

    // Vote the campaign
    await crowdfund.connect(voter).voteCampaign(1);

    // Add goals to the campaign
    const addGoalsTx = await crowdfund.addGoals(1, [
      {
        id: 0,
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

    // Pledge to the campaign
    const pledgeTokens = ethers.utils.parseUnits("100", TOKEN_DECIMALS);
    const pledgeTx = await crowdfund.connect(user).pledge(1, pledgeTokens);
    await pledgeTx.wait();

    // Retrieve the campaign details
    await expect(crowdfund.claimGoal(1, 0)).to.emit(crowdfund, "GoalClaimed");
    await expect(
      crowdfund.attachProof(
        1,
        0,
        "mtwirsqawjuoloq2gvtyug2tc3jbf5htm2zeo4rsknfiv3fdp46a"
      )
    ).to.emit(crowdfund, "ProofAttached");

    let goal = await crowdfund.goals(1, 0);
    expect(goal.status).to.be.equal(1);

    const validateTx = await crowdfund
      .connect(validator)
      .validateProof(1, 0, 4);
    await validateTx.wait();

    goal = await crowdfund.goals(1, 0);
    expect(goal.status).to.be.equal(4);
  });

  it("cannot claim the goal", async () => {
    const { crowdfund, voter, user } = await loadFixture(
      getCrowdfundContractAndAccounts
    );
    const { startAt, endAt } = await getStartAndFinish((deltaStart = 10));

    // Create a new campaign
    await crowdfund.create(1, startAt, endAt);

    // Vote the campaign
    await crowdfund.connect(voter).voteCampaign(1);

    // Add goals to the campaign
    const addGoalsTx = await crowdfund.addGoals(1, [
      {
        id: 0,
        price: ethers.utils.parseUnits("1000", TOKEN_DECIMALS),
      },
    ]);
    await addGoalsTx.wait();

    // Start the campaign
    await time.increase(30);

    await expect(crowdfund.updateCampaigns()).to.emit(
      crowdfund,
      "CampaignUpdated"
    );

    // Pledge to the campaign
    const pledgeTokens = ethers.utils.parseUnits("100", TOKEN_DECIMALS);
    const pledgeTx = await crowdfund.connect(user).pledge(1, pledgeTokens);
    await pledgeTx.wait();

    // Retrieve the campaign details
    await expect(crowdfund.claimGoal(1, 0)).to.be.revertedWith(
      "Not enough money"
    );
  });
});
