// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/tests/MockV3Aggregator.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockAggregator is MockV3Aggregator {
    constructor() MockV3Aggregator(2, 1800) {}
}
