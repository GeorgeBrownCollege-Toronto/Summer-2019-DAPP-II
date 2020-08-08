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
    // console.log(drizzle.contracts.SurveyFactory.methods.createSurvey());
    // console.log(drizzleState.accounts);
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

        {/* <ContractForm
          drizzle={drizzle}
          contract="SurveyFactory"
          method="createSurvey"
          sendArgs={{
            from: drizzleState.accounts[1],
            value: 2000000000000000000,
            gas: 2100000000,
          }}
        /> */}
      </div>

      {/* <div className="section">
        <h2>TutorialToken</h2>
        <p>
          Here we have a form with custom, friendly labels. Also note the token
          symbol will not display a loading indicator. We've suppressed it with
          the <code>hideIndicator</code> prop because we know this variable is
          constant.
        </p>
        <p>
          <strong>Total Supply: </strong>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="TutorialToken"
            method="totalSupply"
            methodArgs={[{ from: drizzleState.accounts[0] }]}
          />{" "}
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="TutorialToken"
            method="symbol"
            hideIndicator
          />
        </p>
        <p>
          <strong>My Balance: </strong>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="TutorialToken"
            method="balanceOf"
            methodArgs={[drizzleState.accounts[0]]}
          />
        </p>
        <h3>Send Tokens</h3>
        <ContractForm
          drizzle={drizzle}
          contract="TutorialToken"
          method="transfer"
          labels={["To Address", "Amount to Send"]}
        />
      </div> */}

      {/* <div className="section">
        <h2>ComplexStorage</h2>
        <p>
          Finally this contract shows data types with additional considerations.
          Note in the code the strings below are converted from bytes to UTF-8
          strings and the device data struct is iterated as a list.
        </p>
        <p>
          <strong>String 1: </strong>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="ComplexStorage"
            method="string1"
            toUtf8
          />
        </p>
        <p>
          <strong>String 2: </strong>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="ComplexStorage"
            method="string2"
            toUtf8
          />
        </p>
        <strong>Single Device Data: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="ComplexStorage"
          method="singleDD"
        />
      </div> */}
    </div>
  );
};
