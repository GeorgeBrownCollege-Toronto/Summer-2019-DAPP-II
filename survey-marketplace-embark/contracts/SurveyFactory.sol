pragma solidity ^0.6.6;

import "./Survey.sol";
import "./Ownable.sol";
import "./SafeMath.sol";

/// @title SurveyFactory - Create surveys and charge users
/// @author dhruvin.parikh@georgebrown.ca

contract SurveyFactory is Ownable {

    /* Declare safemath for uint */
    using SafeMath for uint;

    /* Events */
    event SurveyFactoryInitialized(uint indexed surveyCreationFees);
    event SurveyCreated(uint indexed surveyId, address indexed surveyAddress);

    struct SurveyToOwner{
        address surveyOwner;
        address winner;
        address[] participants;
    }

    /* Contract State */
    uint public surveyCreationFees;
    address[] public surveys;
    mapping(uint => SurveyToOwner) public surveysToOwner;

    /* Modifiers */
    modifier notTheOwner() {
        require(msg.sender != owner(), "Sender should not be the owner");
        _;
    }
    
    modifier surveyExists(uint _surveyId) {
            require(surveysToOwner[_surveyId].surveyOwner != address(0), "No such survey exists");
            _;
    }
    
    modifier winnerNotRevealed(uint _surveyId) {
        require(surveysToOwner[_surveyId].winner == address(0), "This winner is already declared");
        _;
    }
    
    modifier winnerRevealed(uint _surveyId) {
        require(surveysToOwner[_surveyId].winner != address(0), "This winner is not declared");
        _;
    }
    
    modifier isWinner(uint _surveyId) {
        require(surveysToOwner[_surveyId].winner == msg.sender, "Only winner can call");
        _;
    }
    
    modifier notTheSurveyOwner(uint _surveyId) {
        require(surveysToOwner[_surveyId].surveyOwner != msg.sender, "Sender should not be the survey owner");
        _;
    }
    
    modifier isSurveyOwner(uint _surveyId) {
        require(surveysToOwner[_surveyId].surveyOwner == msg.sender, "Sender should not be the survey owner");
        _;
    }

    /// @notice Contructor of the Survey Factory Contract
    /// @param _surveyCreationFees - The fees to charge the survey creator when their survey is created
    /// @dev Intiliase the survey factory with the survey creation fees.
    constructor(uint _surveyCreationFees) public {
        surveyCreationFees = _surveyCreationFees;
        emit SurveyFactoryInitialized(surveyCreationFees);
    }

    function createSurvey() external payable notTheOwner returns(uint surveyId, address newSurveyAddress){
        require(msg.value > surveyCreationFees, "Value must be greater than survey creation fees");
        
        /* Calculate Reward */
        uint surveyReward = msg.value.sub(surveyCreationFees);

        /* Create new instance of the survey */
        address _newSurveyAddress = address(new Survey{value: surveyReward}(msg.sender));

        /* Calculate surveyId */
        surveys.push(_newSurveyAddress);
        uint _surveyId = surveys.length.sub(1);

        surveysToOwner[_surveyId].surveyOwner = msg.sender;
        emit SurveyCreated(_surveyId, _newSurveyAddress);
        return (_surveyId, _newSurveyAddress);
    }
    
    function addSurveyParticipant(uint _surveyId) notTheOwner notTheSurveyOwner(_surveyId) surveyExists(_surveyId) winnerNotRevealed(_surveyId) public {
        surveysToOwner[_surveyId].participants.push(msg.sender);
    }
    
    function revealSurveyWinner(uint _surveyId) notTheOwner surveyExists(_surveyId) isSurveyOwner(_surveyId) winnerNotRevealed(_surveyId) public returns (address){
        uint randomIndex = (block.number / surveysToOwner[_surveyId].participants.length)% surveysToOwner[_surveyId].participants.length;
        surveysToOwner[_surveyId].winner = surveysToOwner[_surveyId].participants[randomIndex];
        return surveysToOwner[_surveyId].participants[0];
    }
    
    function claimReward(uint _surveyId) notTheOwner surveyExists(_surveyId) notTheSurveyOwner(_surveyId) winnerRevealed(_surveyId) isWinner(_surveyId) public returns (bool success) {
    (bool isCallSucceed, ) = surveys[_surveyId].call(abi.encode(keccak256(abi.encodePacked("transferReward(address)")), surveysToOwner[_surveyId].winner));
    if (!isCallSucceed) {
        revert();
    }
        return true;
    }
}