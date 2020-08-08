import React from "react";
import { newContextComponents } from "@drizzle/react-components";

const { AccountData, ContractData, ContractForm } = newContextComponents;

export default ({ drizzle, drizzleState }) => {
  const [surveyCount, setSurveyCount] = React.useState(0);
  const [surveys, setSurveys] = React.useState([]);
  const [cs, setCS] = React.useState(null);
  const [currentAccount, setCurrentAccount] = React.useState(null);
  const [accountIndex, setAccountIndex] = React.useState(0);
  const handleCreateSurvey = () => {
    const x = drizzle.contracts.SurveyFactory.methods.createSurvey().send({
      value: "2000000000000000000",
      from: currentAccount,
      gasLimit: 2100000,
    });
    setCS(x);
  };

  const handleOnChange = (index) => (event) => {
    setAccountIndex(index);
    setCurrentAccount(event.target.value);
  };

  React.useEffect(() => {
    async function getAllSurveys() {
      const surveyArr = await drizzle.contracts.SurveyFactory.methods
        .getAllSurveys()
        .call();
      setSurveyCount(surveyArr.length);
      setSurveys(surveyArr);
    }
    getAllSurveys();
  }, [cs, surveyCount, surveys]);

  // destructure drizzle and drizzleState from props
  return (
    <div className="App">
      <div>
        <h1>Survey Marketplace</h1>
      </div>

      <div className="section">
        <h2>Active Account</h2>
        {Object.keys(drizzleState.accounts).map((x, index) => (
          <p>
            <input
              type="radio"
              value={drizzleState.accounts[index]}
              checked={accountIndex == index}
              onChange={handleOnChange(index)}
            />
            <AccountData
              drizzle={drizzle}
              drizzleState={drizzleState}
              accountIndex={index}
              units="ether"
              precision={3}
            />
          </p>
        ))}
      </div>

      <div className="section">
        <h2>Survey marketplace</h2>
        <p>
          <strong>Survey creation fees : </strong>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="SurveyFactory"
            method="surveyCreationFees"
          />{" "}
          Ether
        </p>

        <p>
          <strong>Survey listings to owner </strong>
          <table>
            <tr>
              <th>Owner</th>
              <th>Survey Address</th>
            </tr>
            {surveys.map((surveyAddr, index) => (
              <tr>
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
          </table>
        </p>

        <button onClick={handleCreateSurvey}>CreateSurvey</button>
      </div>
    </div>
  );
};
