import React from "react";
import { newContextComponents } from "@drizzle/react-components";
const { ContractData } = newContextComponents;

export default ({ drizzle, drizzleState }) => {
  const [surveyCount, setSurveyCount] = React.useState(0);
  const [surveys, setSurveys] = React.useState([]);
  const [currentAccount, setCurrentAccount] = React.useState(
    drizzleState.accounts[0]
  );
  const [allAccounts, setAllAccounts] = React.useState(
    Object.keys(drizzleState.accounts)
  );

  const handleCreateSurvey = () => {
    const x = drizzle.contracts.SurveyFactory.methods.createSurvey().send({
      value: "2000000000000000000",
      from: currentAccount,
      gasLimit: 2100000,
    });
    x.then(({ events }) => {
      setSurveyCount(events.SurveyCreated.returnValues["0"]);
    });
  };

  const handleOnChange = (event) => {
    setCurrentAccount(event.target.value);
  };

  React.useEffect(() => {
    async function getAllSurveys() {
      const surveyArr = await drizzle.contracts.SurveyFactory.methods
        .getAllSurveys()
        .call();
      setSurveys(surveyArr);
    }
    getAllSurveys();
  }, [surveyCount]);
  // destructure drizzle and drizzleState from props
  return (
    <div className="App">
      <div>
        <h1>Survey Marketplace</h1>
      </div>

      <div className="section">
        <label htmlFor="account-select">Choose an account:</label>
        <select
          name="accounts"
          id="account-select"
          value={currentAccount}
          onChange={handleOnChange}
        >
          {allAccounts.map((x, index) => (
            <option key={x} value={drizzleState.accounts[index]}>
              {drizzleState.accounts[index]} (
              {drizzle.web3.utils.fromWei(
                drizzleState.accountBalances[drizzleState.accounts[index]],
                "ether"
              )}{" "}
              ether)
            </option>
          ))}
        </select>
      </div>

      <div className="container">
        <div>
          <div>Survey creation fees : </div>
          <div>
            <ContractData
              drizzle={drizzle}
              drizzleState={drizzleState}
              contract="SurveyFactory"
              method="surveyCreationFees"
            />{" "}
            Ether
          </div>
          <button onClick={handleCreateSurvey}>CreateSurvey</button>
        </div>
        <div>
          <strong>Survey listings to owner </strong>
          <table>
            <thead>
              <tr>
                <th>Owner</th>
                <th>Survey Address</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((surveyAddr, index) => (
                <tr key={surveyAddr}>
                  <td>
                    <ContractData
                      drizzle={drizzle}
                      drizzleState={drizzleState}
                      contract="SurveyFactory"
                      method="surveyToOwner"
                      methodArgs={[`${index}`]}
                    />
                  </td>
                  <td>{surveyAddr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
