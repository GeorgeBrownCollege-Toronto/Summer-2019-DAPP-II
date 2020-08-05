// SPDX-License-Identifier: MIT

pragma solidity >0.4.0 <0.7.0;

import "./Survey.sol";
import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract SurveyFactory is Ownable {

    using SafeMath for uint;
    uint public surveyCreationFees;
    address[] public surveys;
    mapping(uint => address) public surveyToOwner;
    event SurveyFactoryinitialized(uint indexed surveyCreationFees);

    constructor(uint _surveyCreationFees) public {
        surveyCreationFees = _surveyCreationFees;
        emit SurveyFactoryInitialized(surveyCreationFees);
    }

    modifier notTheOwner(){
        require(msg.sender != owner(),"SurveyFactory: restricted");
        _;
    }

    function createSurvey() external notTheOwner  payable returns(uint surveyId, address newSurveyAddress) {
        require(msg.value > surveyCreationFees,"SurveyFactory: Not enough ethers");
        uint surveyReward = msg.value.sub(surveyCreationFees);
        Survey  newSurvey = new Survey{value:surveyReward}(msg.sender);
        newSurveyAddress = address(newSurvey);
        surveys.push(newSurveyAddress);
        surveyId = surveys.length;
        surveyToOwner[surveyId] = newSurveyAddress;
        emit SurveyCreated(surveyId, newSurveyAddress);
    }

    event SurveyCreated(uint indexed surveyId, address indexed newSurveyAddress);
    event SurveyFactoryInitialized(uint indexed surveyCreationFees);
}
