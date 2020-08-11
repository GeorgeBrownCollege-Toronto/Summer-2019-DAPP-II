const SurveyFactory = artifacts.require("SurveyFactory");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(SurveyFactory, web3.utils.toBN("2", "wei"));
};
