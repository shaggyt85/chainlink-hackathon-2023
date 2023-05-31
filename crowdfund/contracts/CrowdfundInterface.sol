// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface CrowdfundInterface {
    struct NewGoal {
        uint256 id;
        uint256 price;
    }

    enum CampaignStatus {
        NEW,
        CREATED,
        LOADED,
        STARTED,
        INVALID,
        CLAIMED,
        FINISHED
    }
    enum GoalStatus {
        PENDING,
        PROOF_VALIDATION,
        REVALIDATE,
        INVALID,
        VALID,
        CLAIMED
    }

    struct Campaign {
        uint256 id;
        address creator;
        CampaignStatus status;
        uint256 startAt;
        uint256 endAt;
        uint256 votes;
        uint256 goals;
    }

    struct Goal {
        uint256 id;
        uint256 price;
        GoalStatus status;
        string proof;
    }

    struct Funds {
        uint256 eth;
        uint256 tokens;
    }

    event CampaignCreated(uint256 indexed id, address indexed creator);
    event CampaignCancelled(uint256 indexed id, address indexed cancelled_by);
    event CampaignUpdated(uint256 indexed id, CampaignStatus status);
    event GoalsAdded(uint256 indexed id, NewGoal[] goals);
    event Pledged(uint256 indexed id, address indexed pledger, uint256 amount);
    event Unpledged(uint256 indexed id, address indexed pledger);
    event CampaignVotesUpdated(uint256 indexed id, uint256 votes);
    event GoalClaimed(
        uint256 indexed id,
        uint256 indexed goal_id,
        address indexed claimer
    );
    event ProofAttached(
        uint256 indexed id,
        uint256 indexed goal_id,
        address indexed attachBy
    );
    event ProofValidated(
        uint256 indexed id,
        uint256 indexed goal_id,
        GoalStatus status
    );
    event CampaignVoted(uint256 indexed id, address indexed voter);

    function create(uint256 _goals, uint256 _startAt, uint256 _endAt) external;

    function cancel(uint256 _id) external;

    function addGoals(uint256 _id, NewGoal[] calldata _goals) external;

    function pledge(uint256 _id, uint256 _amount) external payable;

    function unpledge(uint256 _id) external;

    function getCampaigns() external view returns (Campaign[] memory);

    function getGoals(uint256 _id) external view returns (Goal[] memory);

    function claimGoal(uint256 _id, uint256 _goal_id) external;

    function attachProof(
        uint256 _id,
        uint256 _goal_id,
        string calldata _goalProof
    ) external;

    function validateProof(
        uint256 _id,
        uint256 _goal_id,
        GoalStatus _status
    ) external;

    function voteCampaign(uint256 _id) external;
}
