// SPDX-License-Identifier: MIT

pragma solidity ^0.6.10;

contract Survey {

    address public owner;
    address public factory;

    event SurveyInitialized(address indexed owner, uint indexed surveyReward);

    constructor(address _owner) payable public {
        require(_owner != address(0),"Survey: Invalid owner address");
        require(msg.value > 0, "Survey: The reward amount should be greater than zero");
        owner = _owner;
        factory = msg.sender;
        emit SurveyInitialized(owner,msg.value);
    }
}