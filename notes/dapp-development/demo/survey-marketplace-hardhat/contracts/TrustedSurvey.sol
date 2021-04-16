// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

contract TrustedSurvey {

    address public owner;
    address public factory;

    event SurveyInitialized(address indexed owner, uint256 indexed surveyReward);

    constructor(address _owner) payable {
        require(_owner != address(0), "Survey:Invalid owner address");
        require(msg.value > 0, "Survey: amount greter than zero");
        owner = _owner;
        factory = msg.sender;
        emit SurveyInitialized(owner, msg.value);
    }
}