// Import the necessary dependencies for testing
const { expect } = require("chai");
const {
  loadFixture,
  time,
} = require("@nomicfoundation/hardhat-network-helpers");
const { getCrowdfundContractAndAccounts } = require("./utils");

describe("Roles", () => {
  it("should grant and revoke roles correctly", async () => {
    const { crowdfund, voter, validator } = await loadFixture(
      getCrowdfundContractAndAccounts
    );

    // Check initial roles
    expect(await crowdfund.hasRole(await crowdfund.VOTER_ROLE(), voter.address))
      .to.be.true;
    expect(
      await crowdfund.hasRole(
        await crowdfund.VALIDATOR_ROLE(),
        validator.address
      )
    ).to.be.true;

    // Revoke roles
    await crowdfund.revokeVoterRole(voter.address);
    await crowdfund.revokeValidatorRole(validator.address);

    // Check if roles are revoked
    expect(await crowdfund.hasRole(await crowdfund.VOTER_ROLE(), voter.address))
      .to.be.false;
    expect(
      await crowdfund.hasRole(
        await crowdfund.VALIDATOR_ROLE(),
        validator.address
      )
    ).to.be.false;

    // Grant roles again
    await crowdfund.grantVoterRole(voter.address);
    await crowdfund.grantValidatorRole(validator.address);

    // Check if roles are granted again
    expect(await crowdfund.hasRole(await crowdfund.VOTER_ROLE(), voter.address))
      .to.be.true;
    expect(
      await crowdfund.hasRole(
        await crowdfund.VALIDATOR_ROLE(),
        validator.address
      )
    ).to.be.true;
  });
});
