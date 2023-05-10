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
    struct Donation {
        address donator;
        uint256 amount;
    }

    struct Campaign {
        address creator;
        CampaignStatus status;
        uint256 pledged;
        uint256 votes;
        uint256 startAt;
        uint256 endAt;
        uint256 goals;
    }

    enum CampaignStatus {
        CREATED, // new
        STARTED, // validated, can start
        FINISHED, // finished at time, unsuccesful
        CLAIMED, // finished at time, succesful
        SCAM // finished before
    }
    enum GoalStatus {
        PENDING,
        BLOCKED,
        CLAIMED,
        PROOF,
        VALID,
        INVALID
    }

    struct NewGoal {
        uint256 price;
        uint256 id;
    }

    struct Goal {
        uint256 id;
        uint256 price;
        GoalStatus status;
        string proof;
    }

    struct Item {
        uint256 timestamp;
        uint256 price;
    }

    IERC20 public immutable token;
    uint256 public count;
    uint256 public maxDuration;
    uint256 public minVotes;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(uint256 => Goal)) public goals;
    mapping(uint256 => mapping(address => uint256)) public pledgedAmount;

    mapping(address => uint256) public reputation;

    event Create(
        uint256 id,
        address indexed creator,
        uint256 total,
        uint32 startAt,
        uint32 endAt
    );
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
        // require(_goals.length > 0, "It needs at least one goal");

        count += 1;
        uint256 total = 0;
        // for (uint256 i = 0; i < _goals.length; i++) {
        //     Goal memory goal = Goal(
        //         _goals[i].id,
        //         _goals[i].price,
        //         GoalStatus.BLOCKED,
        //         ""
        //     );

        //     total += _goals[i].price;
        //     // if (i == 0) {
        //     //     goal.status = GoalStatus.PENDING;
        //     // }
        //     goals[count][i] = goal;
        // }

        campaigns[count] = Campaign({
            creator: msg.sender,
            status: CampaignStatus.CREATED,
            pledged: 0,
            startAt: _startAt,
            endAt: _endAt,
            votes: 0,
            goals: _goals
        });
        emit Create(count, msg.sender, total, _startAt, _endAt);
    }

    function cancel(uint256 _id) external {
        Campaign memory campaign = campaigns[_id];
        require(
            campaign.creator == msg.sender,
            "You did not create this Campaign"
        );
        require(
            block.timestamp < campaign.startAt,
            "Campaign has already started"
        );

        delete campaigns[_id];
        emit Cancel(_id);
    }

    function pledge(uint256 _id, uint256 _amount) external {
        Campaign storage campaign = campaigns[_id];

        require(
            campaign.status == CampaignStatus.STARTED,
            "Campaign hasn't started yet"
        );
        campaign.pledged += _amount;
        pledgedAmount[_id][msg.sender] += _amount;
        token.transferFrom(msg.sender, address(this), _amount); // TODO: require

        emit Pledge(_id, msg.sender, _amount);
    }

    function startCampaigns() external {
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

    function finishCampaigns() external {}

    function pledge(uint256 _id) external payable {
        Campaign storage campaign = campaigns[_id];

        require(
            campaign.status == CampaignStatus.STARTED,
            "Campaign hasn't started yet"
        );
        // cxonvert to token
        // campaign.pledged += _amount;
        // pledgedAmount[_id][msg.sender] += _amount;
        // token.transferFrom(msg.sender, address(this), _amount); // TODO: require

        // emit Pledge(_id, msg.sender, _amount);
    }

    function unPledge(uint256 _id) external {
        Campaign storage campaign = campaigns[_id];
        require(
            block.timestamp >= campaign.startAt,
            "Campaign has not Started yet"
        );
        require(
            campaign.status == CampaignStatus.SCAM ||
                block.timestamp >= campaign.endAt,
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

    function claimNextGoal(uint256 _id) external {
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.creator == msg.sender,
            "You did not create this Campaign"
        );
        require(block.timestamp <= campaign.endAt, "Campaign ended");
        require(
            campaign.status == CampaignStatus.STARTED,
            "Campaign should be started"
        );
        require(goals[_id][0].status == GoalStatus.CLAIMED, "Needs attachment");
        uint256 goalId = 0;

        for (uint256 i = 0; i < campaign.goals; i++) {
            if (goals[_id][i].status == GoalStatus.PENDING) {
                goalId = i;
                break;
            }
        }
        if (goalId > 0) {
            require(
                goals[_id][goalId].status == GoalStatus.VALID,
                "Previous item is not valid yet"
            );
        }

        require(
            campaign.pledged >= goals[_id][goalId].price,
            "Not enough money"
        );
        campaign.pledged -= goals[_id][goalId].price;

        token.transfer(campaign.creator, campaign.pledged);

        // emit Claim(_id, _goals);
    }

    function attachProof(
        uint256 _id,
        uint256 _goal_id,
        string calldata _goal_proof
    ) external {
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.creator == msg.sender,
            "You did not create this Campaign"
        );
        require(
            campaign.status == CampaignStatus.STARTED,
            "Campaign should be started"
        );

        require(
            goals[_id][_goal_id].status == GoalStatus.CLAIMED,
            "Cannot attach proof"
        );

        goals[_id][_goal_id].status = GoalStatus.PROOF;
        goals[_id][_goal_id].proof = _goal_proof;
    }

    function refund(uint256 _id) external {
        Campaign memory campaign = campaigns[_id];
        require(
            campaign.status == CampaignStatus.FINISHED ||
                campaign.status == CampaignStatus.SCAM,
            "not ended"
        );

        uint256 bal = pledgedAmount[_id][msg.sender];
        pledgedAmount[_id][msg.sender] = 0;
        token.transfer(msg.sender, bal);

        emit Refund(_id, msg.sender, bal);
    }
}
