/*global artifacts, contract, config, it, assert, web3*/
const SurveyFactory = artifacts.require("SurveyFactory");
let accounts;

// For documentation please see https://framework.embarklabs.io/docs/contracts_testing.html
config(
  {
    //blockchain: {
    //  accounts: [
    //    // you can configure custom accounts with a custom balance
    //    // see https://framework.embarklabs.io/docs/contracts_testing.html#Configuring-accounts
    //  ]
    //},
    contracts: {
      deploy: {
        SurveyFactory: {
          args: [1000000000000],
        },
      },
    },
  },
  (_err, web3_accounts) => {
    accounts = web3_accounts;
  }
);

contract("Create Survey", () => {
  // Test#1
  it(`1. Given that I'm the Survey owner, 
  when I try to create a survey and include the survey creation costs and survey reward,
  then I should be able to get the created survey reference number and address.`, async () => {
    let result = await SurveyFactory.methods
      .createSurvey()
      .send({ from: accounts[1], value: 1200000000000 });
    const sur_id = result.events.SurveyCreated.returnValues["surveyId"];
    const sur_addr = result.events.SurveyCreated.returnValues["surveyAddress"];
    // // The first survey should be starting with 1
    assert.equal(parseInt(sur_id, 10), 1);
    // The address of deployed survey contract should pass the checksum
    assert.equal(web3.utils.isAddress(sur_addr), true);
  });

  // Test#2
  it(`2. Given that I'm the survey owner,
  when I try to create a survey and include the survey creation costs,
  I should be made the owner of the survey in the contract`, async () => {
    const survey_owner = accounts[1];
    const result = await SurveyFactory.methods
      .createSurvey()
      .send({ from: survey_owner, value: 1200000000000 });
    const sur_id = result.events.SurveyCreated.returnValues["surveyId"];
    const sur_addr = await SurveyFactory.methods.surveyToOwner(sur_id).call();
    assert.equal(survey_owner, sur_addr);
  });

  // Test#3
  it(`3. If I'm the survey owner, 
  when I try to create a survey and include the survey without survey creation cost, 
  then I should receive a "revert" error`, async () => {
    const survey_owner = accounts[1];
    assert.reverts(
      await SurveyFactory.methods.createSurvey(),
      { from: survey_owner },
      "Returned error: VM Exception while processing transaction: revert Value must be greater than survey creation fees"
    );
  });

  // Test #4
  it(`4. If I'm survey marketplace's app owner, 
              When I try to create a new survey,
              then I should receive a "revert" error`, async () => {
    const survey_dapp_owner = await SurveyFactory.methods.owner().call();
    assert.reverts(
      await SurveyFactory.methods.createSurvey(),
      { from: survey_dapp_owner, value: 1200000000000 },
      "Returned error: VM Exception while processing transaction: revert Ownable: caller is not the owner"
    );
  });
});
