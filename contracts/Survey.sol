pragma solidity ^0.6.6;

/// @title Marketplace for survey creators - A survey instant created by SurveyFactory to randomize the process of fees
/// @author dhruvin.parikh@georgebrown.ca

contract Survey {
    /* Events */
    event SurveyInitialized(address indexed owner,uint indexed surveyReward);

    /* Contract State */
    address public owner;
    address private factory;
    
    /* modifiers */
    modifier onlyFactory() {
        require(factory == msg.sender, "Only factory can call.");
        _;
    }

    constructor(address _owner) payable public {
        require(_owner != address(0),"onwer's address should not be zero");
        require(msg.value > 0, "value of ether should be non-zero");

        owner = _owner;
        factory = msg.sender;
        emit SurveyInitialized(owner, msg.value);
    }
    
    function transferReward(address payable _winner) public onlyFactory payable returns (bool) {
        _winner.transfer(address(this).balance);
        return true;
    }
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}