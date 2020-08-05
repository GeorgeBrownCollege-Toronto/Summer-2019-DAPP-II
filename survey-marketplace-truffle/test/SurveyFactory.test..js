const {
  CommonVariables,
  Survey,
  SurveyFactory,
  BigNumber,
  expectRevert,
  should,
} = require("./helpers/commons");
const { expect } = require("chai");

contract("SurveyFactory", (_accounts) => {
  const commonVars = new CommonVariables(_accounts);

  let accounts = commonVars.accounts;

  const _appOwner = commonVars.appOwner;
  const _surveyMaker = commonVars.surveyMaker;
  const _participants = commonVars.participants;

  const _surveyCreationCost = commonVars.surveyCreationCost;
  const _surveyReward = commonVars.surveyReward;
  const _surveyRewardAndCreationCost = commonVars.surveyRewardAndCreationCost;

  let surveyFactory;

  beforeEach(async () => {
    surveyFactory = await SurveyFactory.new(_surveyCreationCost, {
      from: _appOwner,
    });
  });

  describe("test cases for createSurvey function", () => {
    it("The survey maker should have survey ID and survey address", async () => {
      return surveyFactory.createSurvey
        .call({
          value: _surveyRewardAndCreationCost,
          from: _surveyMaker,
        })
        .should.eventually.have.keys("surveyId", "0", "1", "newSurveyAddress");
    });
    it("Survey maker should be the owner of the newly create survey contract", async () => {
      surveyFactory.createSurvey
        .sendTransaction({
          value: _surveyRewardAndCreationCost,
          from: _surveyMaker,
        })
        .then((createSurveyTx) => {
          return Survey.at(
            createSurveyTx.receipt.logs[0].args["newSurveyAddress"]
          );
        })
        .then((instance) => {
          return instance.owner.call();
        })
        .should.eventually.equal(_surveyMaker);
    });
    it("It should not allow if survey creation cost is not included", () => {});
    it("It should not allow if app owner is trying to create survey", () => {});
  });
});
