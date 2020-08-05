const _ = require("lodash");
const Survey = artifacts.require("Survey");
const SurveyFactory = artifacts.require("SurveyFactory");
const BigNumber = web3.utils.BN;
const expectRevert = require("./expectRevert");
const should = require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should(); //To enable should chai style
class CommonVariables {
  constructor(_accounts) {
    this.accounts = _accounts;
    this.surveyMaker = _accounts[0];
    this.appOwner = _accounts[1];
    this.participants = _.difference(_accounts, [_accounts[0], _accounts[1]]);

    this.surveyCreationCost = web3.utils.toWei("1", "ether");
    this.surveyReward = web3.utils.toWei("1", "ether");
    this.surveyRewardAndCreationCost = web3.utils.toWei("2", "ether");
  }
}

module.exports = {
  CommonVariables,
  Survey,
  SurveyFactory,
  BigNumber,
  expectRevert,
  should,
};
