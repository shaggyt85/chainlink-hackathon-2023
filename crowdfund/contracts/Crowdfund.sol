// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function transfer(address, uint256) external returns (bool);

    function transferFrom(address, address, uint256) external returns (bool);
}

/**
 * @title CrowdFund Smart Contract
 */
// TODO:
// - check ETH -> USD + stable coin when withdrawing
// AAVE https://github.com/Okiki-Olugunna/Crowdfunding-DeFi/tree/main
// https://github.com/aindrajaya/dapp-crowdfunding-client
// chainlink automation -> start and finish
contract CrowdFund is Ownable {
    struct Campaign {
        address creator;
        CampaignStatus status;
        uint256 pledged;
        uint256 votes;
        uint256 startAt;
        uint256 endAt;
        uint256 goals;
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
        BLOCKED,
        CLAIMED,
        PROOF,
        VALID,
        INVALID,
        REVALIDATE
    }

    IERC20 public immutable token;
    uint256 public count;
    uint256 public maxDuration;
    uint256 public minVotes;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(uint256 => Goal)) public goals;
    mapping(uint256 => mapping(address => uint256)) public pledgedAmount;

    mapping(address => uint256) public reputation;

    event Create(address indexed creator, uint256 id);
    event Cancel(uint256 id);
    event Pledge(uint256 indexed id, address indexed caller, uint256 amount);
    event Unpledge(uint256 indexed id, address indexed caller, uint256 amount);
    event Claim(uint256 id, uint256[] goals);
    event Refund(uint256 id, address indexed caller, uint256 amount);

    constructor(address _token, uint256 _maxDuration, uint256 _minVotes) {
        token = IERC20(_token);
        maxDuration = _maxDuration;
        minVotes = _minVotes;
    }

    // Modifiers

    modifier campaignStarted(uint256 _id) {
        Campaign memory campaign = campaigns[_id];
        require(
            campaign.status == CampaignStatus.STARTED,
            "Campaign hasn't started yet"
        );
        _;
    }

    modifier campaignOwner(uint256 _id) {
        Campaign memory campaign = campaigns[_id];
        require(
            campaign.creator == msg.sender,
            "You did not create this Campaign"
        );
        _;
    }

    // Campaings
    function create(uint32 _goals, uint32 _startAt, uint32 _endAt) external {
        require(
            _startAt >= block.timestamp,
            "Start time is less than current Block Timestamp"
        );
        require(_endAt > _startAt, "End time is less than Start time");
        require(
            _endAt <= block.timestamp + maxDuration,
            "End time exceeds the maximum Duration"
        );

        count += 1;
        campaigns[count] = Campaign({
            creator: msg.sender,
            status: CampaignStatus.CREATED,
            pledged: 0,
            startAt: _startAt,
            endAt: _endAt,
            votes: 0,
            goals: _goals
        });
        emit Create(msg.sender, count);
    }

    function cancel(uint256 _id) external campaignOwner(_id) {
        Campaign memory campaign = campaigns[_id];

        require(campaign.status == CampaignStatus.CREATED, "Cannot cancel");

        delete campaigns[_id];
        emit Cancel(_id);
    }

    function addGoals(
        uint256 _id,
        NewGoal[] calldata _goals
    ) external campaignOwner(_id) {
        for (uint256 i = 0; i < _goals.length; i++) {
            Goal memory goal = Goal(
                _goals[i].id,
                _goals[i].price,
                GoalStatus.BLOCKED,
                ""
            );
            goals[_id][i] = goal;
        }
        goals[_id][0].status = GoalStatus.PENDING;
        campaigns[_id].status = CampaignStatus.LOADED;
        campaigns[_id].goals = _goals.length;
    }

    // Donations

    function pledge(
        uint256 _id,
        uint256 _amount
    ) external campaignStarted(_id) {
        Campaign storage campaign = campaigns[_id];

        require(
            campaign.status == CampaignStatus.STARTED,
            "You can not pledge"
        );
        campaign.pledged += _amount;
        pledgedAmount[_id][msg.sender] += _amount;
        token.transferFrom(msg.sender, address(this), _amount); // TODO: require

        emit Pledge(_id, msg.sender, _amount);
    }

    function unPledge(uint256 _id) external {
        Campaign storage campaign = campaigns[_id];

        require(
            campaign.status == CampaignStatus.INVALID ||
                campaign.status == CampaignStatus.FINISHED,
            "You can not unpledge"
        );
        require(
            pledgedAmount[_id][msg.sender] > 0,
            "You do not have enough tokens Pledged to withraw"
        );
        uint256 userAmount = pledgedAmount[_id][msg.sender];
        delete pledgedAmount[_id][msg.sender];
        token.transfer(msg.sender, userAmount);

        emit Unpledge(_id, msg.sender, userAmount);
    }

    function getCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory _campaigns;
        for (uint256 i = 0; i < count; i++) {
            _campaigns[i] = Campaign(
                campaigns[i].creator,
                campaigns[i].status,
                campaigns[i].pledged,
                campaigns[i].votes,
                campaigns[i].startAt,
                campaigns[i].endAt,
                campaigns[i].goals
            );
        }
        return _campaigns;
    }

    function getGoals(uint256 _id) external view returns (Goal[] memory) {
        Goal[] memory _goals;
        Campaign memory campaign = campaigns[_id];

        for (uint256 i = 0; i < campaign.goals; i++) {
            _goals[i] = Goal(
                goals[_id][i].id,
                goals[_id][i].price,
                goals[_id][i].status,
                goals[_id][i].proof
            );
        }
        return _goals;
    }

    function startCampaigns() external {
        for (uint256 i = 0; i < count; i++) {
            if (
                campaigns[i].votes >= minVotes &&
                campaigns[i].status == CampaignStatus.LOADED
            ) {
                Campaign storage campaign = campaigns[i];
                campaign.status = CampaignStatus.STARTED;
                campaigns[i] = campaign;
            }
        }
    }

    function finishCampaigns() external {
        for (uint256 i = 0; i < count; i++) {
            if (
                campaigns[i].votes >= minVotes &&
                campaigns[i].status == CampaignStatus.CREATED
            ) {
                Campaign storage campaign = campaigns[i];
                campaign.status = CampaignStatus.STARTED;
                campaigns[i] = campaign;
            }
        }
    }

    // function pledge(uint256 _id) external payable campaignStarted(_id) {
    // Campaign storage campaign = campaigns[_id];
    // cxonvert to token
    // campaign.pledged += _amount;
    // pledgedAmount[_id][msg.sender] += _amount;
    // token.transferFrom(msg.sender, address(this), _amount); // TODO: require
    // emit Pledge(_id, msg.sender, _amount);
    // }

    // function claim(uint256 _id, uint256[] calldata _goals) external {
    //     //TODO: remove?
    //     Campaign storage campaign = campaigns[_id];
    //     require(
    //         campaign.creator == msg.sender,
    //         "You did not create this Campaign"
    //     );
    //     require(block.timestamp <= campaign.endAt, "Campaign ended");
    //     require(
    //         campaign.status == CampaignStatus.STARTED,
    //         "Campaign should be started"
    //     );
    //     require(goals[_id][0].status == GoalStatus.CLAIMED, "Needs attachment");
    //     uint256 amount = 0;
    //     for (uint256 i = 0; i < _goals.length; i++) {
    //         require(goals[_id][i].status == GoalStatus.PENDING, "Cannot claim");
    //         amount = goals[_id][i].price;
    //         goals[_id][i].status = GoalStatus.CLAIMED;
    //     }

    //     require(campaign.pledged >= amount, "Campaign did not succed");
    //     campaign.pledged -= amount;

    //     if (campaign.goals[_goals.length - 1].status == GoalStatus.CLAIMED) {
    //         campaign.status = CampaignStatus.CLAIMED;
    //     }

    //     token.transfer(campaign.creator, campaign.pledged);

    //     emit Claim(_id, _goals);
    // }

    function claimGoal(
        uint256 _id,
        uint256 _goalId
    ) external campaignStarted(_id) campaignOwner(_id) {
        Campaign storage campaign = campaigns[_id];

        if (_goalId > 0) {
            require(
                goals[_id][_goalId].status == GoalStatus.VALID,
                "Previous item is not valid yet"
            );
        } else {}

        require(
            campaign.pledged >= goals[_id][_goalId].price,
            "Not enough money"
        );
        campaign.pledged -= goals[_id][_goalId].price;

        token.transfer(campaign.creator, campaign.pledged);

        // emit Claim(_id, _goals);
    }

    function attachProof(
        uint256 _id,
        uint256 _goal_id,
        string calldata _goal_proof
    ) external campaignStarted(_id) campaignOwner(_id) {
        require(
            goals[_id][_goal_id].status == GoalStatus.CLAIMED,
            "Cannot attach proof"
        );

        goals[_id][_goal_id].status = GoalStatus.PROOF;
        goals[_id][_goal_id].proof = _goal_proof;
    }

    function validateProof(
        uint256 _id,
        uint256 _goal_id,
        GoalStatus _status
    ) external campaignStarted(_id) {
        require(
            goals[_id][_goal_id].status == GoalStatus.PROOF,
            "Cannot validate proof"
        );
        require(
            _status == GoalStatus.REVALIDATE ||
                _status == GoalStatus.INVALID ||
                _status == GoalStatus.VALID,
            "Invalid state"
        );

        goals[_id][_goal_id].status = _status;
    }

    function refund(uint256 _id) external {
        Campaign memory campaign = campaigns[_id];
        require(
            campaign.status == CampaignStatus.FINISHED ||
                campaign.status == CampaignStatus.INVALID,
            "not ended"
        );

        uint256 bal = pledgedAmount[_id][msg.sender];
        pledgedAmount[_id][msg.sender] = 0;
        token.transfer(msg.sender, bal);

        emit Refund(_id, msg.sender, bal);
    }
}
