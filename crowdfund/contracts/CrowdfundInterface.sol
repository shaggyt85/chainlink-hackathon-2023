//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

interface CrowdfundInterface {
    struct Campaign {
        address creator;
        CampaignStatus status;
        uint256 votes;
        uint256 startAt;
        uint256 endAt;
        uint256 goals;
    }
    struct Funds {
        uint256 tokens;
        uint256 eth;
    }
    struct NewGoal {
        uint256 id;
        uint256 price;
    }

    struct Goal {
        uint256 id;
        uint256 price;
        GoalStatus status;
        string proof;
    }

    enum CampaignStatus {
        CREATED, // new
        LOADED, // has all the items
        STARTED, // validated, can start
        FINISHED, // finished at time, unsuccesful
        CLAIMED, // finished at time, succesful
        INVALID // finished before
    }
    enum GoalStatus {
        PENDING,
        CLAIMED,
        PROOF_VALIDATION,
        VALID,
        INVALID,
        REVALIDATE
    }
}
