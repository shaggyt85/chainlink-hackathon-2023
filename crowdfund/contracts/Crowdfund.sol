// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./CrowdfundInterface.sol";

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
contract CrowdFund is Ownable, Pausable, AccessControl, CrowdfundInterface {
    IERC20 public immutable token;
    AggregatorV3Interface internal priceFeed;

    uint256 public count;
    uint256 public maxDuration;
    uint256 public minVotes;

    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Funds) public funds;
    mapping(uint256 => mapping(uint256 => Goal)) public goals;
    mapping(uint256 => mapping(address => uint256)) public pledgedAmount;

    event Create(address indexed creator, uint256 id);
    event Cancel(uint256 id);
    event Pledge(uint256 indexed id, address indexed caller, uint256 amount);
    event Unpledge(uint256 indexed id, address indexed caller, uint256 amount);
    event Claim(uint256 id, uint256[] goals);
    event Refund(uint256 id, address indexed caller, uint256 amount);

    constructor(
        address _token,
        uint256 _maxDuration,
        uint256 _minVotes,
        address _feedAggregator
    ) {
        token = IERC20(_token);
        maxDuration = _maxDuration;
        minVotes = _minVotes;
        priceFeed = AggregatorV3Interface(_feedAggregator);
    }

    // Modifiers

    modifier campaignStarted(uint256 _id) {
        require(
            campaigns[_id].status == CampaignStatus.STARTED,
            "Campaign hasn't started yet"
        );
        _;
    }

    modifier campaignCreated(uint256 _id) {
        require(
            campaigns[_id].status == CampaignStatus.CREATED,
            "Campaign is not created"
        );
        _;
    }

    modifier canUnpledgeFromCampaign(uint256 _id) {
        require(
            campaigns[_id].status == CampaignStatus.INVALID ||
                campaigns[_id].status == CampaignStatus.FINISHED,
            "You can not unpledge"
        );
        _;
    }

    modifier campaignOwner(uint256 _id) {
        require(
            campaigns[_id].creator == msg.sender,
            "You did not create this Campaign"
        );
        _;
    }
    modifier notCampaignOwner(uint256 _id) {
        require(
            campaigns[_id].creator != msg.sender,
            "You did not create this Campaign"
        );
        _;
    }

    // Pause
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev unpauses the stakings and withdrawals
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     *   permissions methods
     */

    /**
     * @dev grants voter role
     * @param _address the address to update roles
     */
    function grantVoterRole(address _address) external onlyOwner {
        _grantRole(VOTER_ROLE, _address);
    }

    /**
     * @dev revokes voter role
     * @param _address the address to update roles
     */
    function revokeVoterRole(address _address) external onlyOwner {
        _revokeRole(VOTER_ROLE, _address);
    }

    /**
     * @dev grants updater role
     * @param _address the address to update roles
     */
    function grantUpdaterRole(address _address) external onlyOwner {
        _grantRole(UPDATER_ROLE, _address);
    }

    /**
     * @dev revokes updater role
     * @param _address the address to update roles
     */
    function revokeUpdaterRole(address _address) external onlyOwner {
        _revokeRole(UPDATER_ROLE, _address);
    }

    /**
     * @dev grants validator role
     * @param _address the address to update roles
     */
    function grantValidatorRole(address _address) external onlyOwner {
        _grantRole(VALIDATOR_ROLE, _address);
    }

    /**
     * @dev revokes validator role
     * @param _address the address to update roles
     */
    function revokeValidatorRole(address _address) external onlyOwner {
        _revokeRole(VALIDATOR_ROLE, _address);
    }

    // Campaings
    function create(uint32 _goals, uint32 _startAt, uint32 _endAt) external {
        require(_startAt >= block.timestamp, "Invalid start");
        require(_endAt > _startAt, "Invalid range");
        require(
            _endAt <= block.timestamp + maxDuration,
            "Invalid range duration"
        );

        count += 1;
        campaigns[count] = Campaign({
            creator: msg.sender,
            status: CampaignStatus.CREATED,
            startAt: _startAt,
            endAt: _endAt,
            votes: 0,
            goals: _goals
        });
        emit Create(msg.sender, count);
    }

    function cancel(uint256 _id) external campaignOwner(_id) {
        require(
            campaigns[_id].status == CampaignStatus.CREATED,
            "Cannot cancel"
        );

        delete campaigns[_id];
        emit Cancel(_id);
    }

    function addGoals(
        uint256 _id,
        NewGoal[] calldata _goals
    ) external campaignOwner(_id) campaignCreated(_id) {
        for (uint256 i = 0; i < _goals.length; i++) {
            goals[_id][i] = Goal(
                _goals[i].id,
                _goals[i].price,
                GoalStatus.PENDING,
                ""
            );
        }
        campaigns[_id].status = CampaignStatus.LOADED;
        campaigns[_id].goals = _goals.length;
    }

    // Donations

    function pledge(
        uint256 _id,
        uint256 _amount
    ) external payable campaignStarted(_id) {
        require(
            campaigns[_id].status == CampaignStatus.STARTED,
            "You can not pledge"
        );
        require(msg.value > 0 || _amount > 0, "Invalids amounts");
        funds[_id].tokens += _amount;
        if (msg.value > 0) {
            funds[_id].eth += msg.value;
        }
        if (_amount > 0) {
            pledgedAmount[_id][msg.sender] += _amount;
        }
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "transfer failed"
        );

        emit Pledge(_id, msg.sender, _amount);
    }

    function unpledge(uint256 _id) external canUnpledgeFromCampaign(_id) {
        require(pledgedAmount[_id][msg.sender] > 0, "Nothing to unpledge");
        uint256 userAmount = pledgedAmount[_id][msg.sender];
        delete pledgedAmount[_id][msg.sender]; //TODO: check
        require(token.transfer(msg.sender, userAmount), "transfer failed");

        emit Unpledge(_id, msg.sender, userAmount);
    }

    function getCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory _campaigns;
        for (uint256 i = 0; i < count; i++) {
            _campaigns[i] = Campaign(
                campaigns[i].creator,
                campaigns[i].status,
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
        for (uint256 i = 0; i < campaigns[_id].goals; i++) {
            _goals[i] = Goal(
                goals[_id][i].id,
                goals[_id][i].price,
                goals[_id][i].status,
                goals[_id][i].proof
            );
        }
        return _goals;
    }

    function betweenTimeRange(uint256 _id) internal view returns (bool) {
        return
            block.timestamp <= campaigns[_id].endAt &&
            block.timestamp >= campaigns[_id].startAt;
    }

    function updateCampaigns() external onlyRole(UPDATER_ROLE) {
        for (uint256 i = 0; i < count; i++) {
            if (campaigns[i].status == CampaignStatus.LOADED) {
                if (campaigns[i].votes >= minVotes && betweenTimeRange(i)) {
                    campaigns[i].status = CampaignStatus.STARTED;
                } else if (block.timestamp > campaigns[i].endAt) {
                    campaigns[i].status = CampaignStatus.FINISHED;
                }
            } else if (campaigns[i].status == CampaignStatus.STARTED) {
                if (betweenTimeRange(i)) {
                    if (
                        goals[i][campaigns[i].goals - 1].status ==
                        GoalStatus.CLAIMED
                    ) {
                        campaigns[i].status = CampaignStatus.CLAIMED;
                    } else {
                        for (uint256 j = 0; j < campaigns[i].goals; j++) {
                            if (goals[i][j].status == GoalStatus.INVALID) {
                                campaigns[i].status = CampaignStatus.INVALID;
                                break;
                            }
                        }
                    }
                } else {
                    campaigns[i].status = CampaignStatus.FINISHED;
                }
            }
        }
    }

    function claimGoal(
        uint256 _id,
        uint256 _goalId
    ) external campaignStarted(_id) campaignOwner(_id) {
        if (_goalId > 0) {
            require(
                goals[_id][_goalId - 1].status == GoalStatus.VALID,
                "Previous goal was not validated"
            );
        }

        (, int price, , , ) = priceFeed.latestRoundData();
        uint256 ethToUSD = funds[_id].eth * uint(price);

        require(
            ethToUSD + funds[_id].tokens > goals[_id][_goalId].price,
            "Not enough money"
        );

        if (funds[_id].tokens < goals[_id][_goalId].price) {
            uint256 diff = (ethToUSD -
                (goals[_id][_goalId].price - funds[_id].tokens)) /
                uint256(price);

            (bool success, ) = msg.sender.call{value: diff}("");

            require(success, "Eth transfer failed.");
        }

        funds[_id].tokens -= goals[_id][_goalId].price;
        require(
            token.transfer(campaigns[_id].creator, goals[_id][_goalId].price),
            "Token transfer failed"
        );

        goals[_id][_goalId].status = GoalStatus.CLAIMED;

        // emit Claim(_id, _goals);
    }

    function attachProof(
        uint256 _id,
        uint256 _goal_id,
        string calldata _goal_proof
    ) external campaignStarted(_id) campaignOwner(_id) {
        require(
            goals[_id][_goal_id].status == GoalStatus.CLAIMED ||
                goals[_id][_goal_id].status == GoalStatus.REVALIDATE,
            "Cannot attach proof"
        );

        goals[_id][_goal_id].status = GoalStatus.PROOF_VALIDATION;
        goals[_id][_goal_id].proof = _goal_proof;
    }

    function validateProof(
        uint256 _id,
        uint256 _goal_id,
        GoalStatus _status
    )
        external
        campaignStarted(_id)
        notCampaignOwner(_id)
        onlyRole(VALIDATOR_ROLE)
    {
        require(
            goals[_id][_goal_id].status == GoalStatus.PROOF_VALIDATION,
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

    function voteCampaign(
        uint256 _id
    ) external campaignCreated(_id) notCampaignOwner(_id) onlyRole(VOTER_ROLE) {
        campaigns[_id].votes++;
    }
}
