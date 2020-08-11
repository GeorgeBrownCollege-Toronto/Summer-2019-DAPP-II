import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import { toast } from "react-toastify";
const { ContractData } = newContextComponents;

export default ({ drizzle, drizzleState }) => {
  const [surveys, setSurveys] = React.useState([]);
  const [currentAccount, setCurrentAccount] = React.useState(
    drizzleState.accounts[0]
  );

  const handleCreateSurvey = () => {
    const tx = drizzle.contracts.SurveyFactory.methods.createSurvey().send({
      value: "4",
      from: currentAccount,
      gasLimit: 2100000,
    });
    tx.then(({ events }) => {
      surveys.unshift(events.SurveyCreated.returnValues["newSurveyAddress"]);
    }).catch((error) => {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
      // Because the array is frozen in strict mode, you'll need to copy the array before sorting it:
      // https://stackoverflow.com/a/53420326
      setSurveys(surveyArr.slice().reverse());
    }
    getAllSurveys();
  });

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
          {Object.keys(drizzleState.accounts).map((x, index) => (
            <option key={x} value={drizzleState.accounts[index]}>
              {drizzleState.accounts[index]}
              {/* (
              {drizzle.web3.utils.fromWei(
                drizzleState.accountBalances[drizzleState.accounts[index]],
                "ether"
              )}{" "}
              ether) */}
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
            wei
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
