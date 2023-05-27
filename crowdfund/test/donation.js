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

describe("Donation", async () => {
  it("should allow users to pledge to a campaign", async () => {
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

    // Pledge to the campaign
    const pledgeAmount = ethers.utils.parseEther("1.0");
    const pledgeTokens = ethers.utils.parseUnits("10", TOKEN_DECIMALS);
    const pledgeTx = await crowdfund.connect(user).pledge(1, pledgeTokens, {
      value: pledgeAmount,
    });
    await pledgeTx.wait();

    // Retrieve the campaign details
    const funds = await crowdfund.funds(1);

    // Verify the campaign balance and total pledged amount
    expect(funds.eth).to.equal(pledgeAmount);
    expect(funds.tokens).to.equal(pledgeTokens);
  });

  it("should allow users to unpledge from a campaign", async () => {
    const { crowdfund } = await loadFixture(getCrowdfundContractAndAccounts);
    const deltaEnd = 100;
    const { startAt, endAt } = await getStartAndFinish(30, deltaEnd);

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
    // Pledge to the campaign
    const pledgeAmount = ethers.utils.parseEther("1.0");
    const pledgeTokens = ethers.utils.parseUnits("10", TOKEN_DECIMALS);
    const pledgeTx = await crowdfund.connect(user).pledge(1, pledgeTokens, {
      value: pledgeAmount,
    });
    await pledgeTx.wait();

    await time.increase(deltaEnd);

    await expect(crowdfund.updateCampaigns()).to.emit(
      crowdfund,
      "CampaignUpdated"
    );
    // Retrieve the initial funds details
    let funds = await crowdfund.funds(1);
    const initialEth = funds.eth;
    const initialTokens = funds.tokens;

    // Unpledge from the campaign
    const unpledgeTx = await crowdfund.connect(user).unpledge(1);
    await unpledgeTx.wait();

    funds = await crowdfund.funds(1);

    // Verify the campaign balance and total pledged amount
    expect(initialEth).to.equal(pledgeAmount);
    expect(initialTokens).to.equal(pledgeTokens);
    expect(funds.eth).to.equal(ethers.utils.parseEther("0"));
    expect(funds.tokens).to.equal(ethers.utils.parseUnits("0", TOKEN_DECIMALS));
  });
});
