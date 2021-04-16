// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "./TrustedSurvey.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SurveyFactory is Ownable {

    struct SurveyDetails {
        address owner;
        uint256 id;
    }

    uint256 public surveyCreationFees;
    address[] public surveys;
    mapping(address => SurveyDetails) public surveyOwners;
    event SurveyFactoryInitialized(uint256 indexed surveyCreationFees);
    event SurveyCreated(address indexed owner, uint256 indexed surveyId, address indexed surveyAddress);


    constructor(uint _surveyCreationFees) {
        surveyCreationFees = _surveyCreationFees;
        emit SurveyFactoryInitialized(surveyCreationFees);
    }

    modifier notTheOwner() {
        require(msg.sender != owner(), "SurveyFactory: restricted");
        _;
    }

    function createSurvey() external notTheOwner payable returns(uint surveyId, address newSurveyAddress) {
        require(msg.value > surveyCreationFees, "SurveyFactory: Not enough ethers");
        // solhint-disable-next-line
        TrustedSurvey newSurvey = new TrustedSurvey{value: msg.value-surveyCreationFees}(msg.sender);
        newSurveyAddress = address(newSurvey);
        surveys.push(newSurveyAddress);
        surveyId = surveys.length - 1;
        surveyOwners[newSurveyAddress] = SurveyDetails({owner:msg.sender, id:surveyId});
        emit SurveyCreated(msg.sender, surveyId, newSurveyAddress);
    }
}