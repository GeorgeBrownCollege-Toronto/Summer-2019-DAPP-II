import EmbarkJS from "Embark/EmbarkJS";
import SurveyFactory from "../../embarkArtifacts/contracts/SurveyFactory";
import Survey from "../../embarkArtifacts/contracts/Survey";
import { InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import React from "react";
import {
  Form,
  FormGroup,
  Input,
  HelpBlock,
  Button,
  FormText
} from "reactstrap";

class SurveyMarketPlace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      valueSet: 10,
      valueGet: "",
      logs: [],
      surveyCreationFees: "0"
    };
  }

  handleChange(e) {
    this.setState({ valueSet: e.target.value });
  }

  checkEnter(e, func) {
    if (e.key !== "Enter") {
      return;
    }
    e.preventDefault();
    func.apply(this, [e]);
  }

  componentDidMount() {
    SurveyFactory.methods
      .surveyCreationFees()
      .call()
      .then(val => {
        this.setState({ surveyCreationFees: val });
      });
  }

  async createSurvey(e) {
    e.preventDefault();
    var value = parseInt(parseFloat(this.state.valueSet) * 1e18);
    // const from = ethereum.selectedAddress;
    // const nonce = await web3.eth.getTransactionCount(from);
    const gasLimit = await SurveyFactory.methods
      .createSurvey()
      .estimateGas({ /*from,*/ value /*, nonce*/ });
    const tx = await SurveyFactory.methods
      .createSurvey()
      .send({ value, gasLimit /*, from, nonce*/ });
    const reward = await web3.eth.getBalance(
      tx.events.SurveyCreated.returnValues["surveyAddress"]
    );
    const surveyOwner = await Survey.at(
      tx.events.SurveyCreated.returnValues["surveyAddress"]
    )
      .methods.owner()
      .call();
    this._addToLog(
      `Survey ${tx.events.SurveyCreated.returnValues["surveyId"]} created at ${
        tx.events.SurveyCreated.returnValues["surveyAddress"]
      } owned by ${surveyOwner} - Reward ${web3.utils.fromWei(reward)} Ξ`
    );
  }

  _addToLog(txt) {
    this.state.logs.push(txt);
    this.setState({ logs: this.state.logs });
  }

  render() {
    return (
      <React.Fragment>
        <h3>
          {" "}
          Survey Creation fees :{" "}
          {web3.utils.fromWei(this.state.surveyCreationFees)} ether
        </h3>
        <h3> 1. Create a Survey </h3>
        <Form onKeyDown={e => this.checkEnter(e, this.createSurvey)}>
          {" "}
          <FormGroup className="inline-input-btn">
            <InputGroup>
              <Input
                placeholder="value in ethers"
                defaultValue={this.state.valueSet}
                onChange={e => this.handleChange(e)}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>Ξ</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <br />
            <Button color="primary" onClick={e => this.createSurvey(e)}>
              Create Survey
            </Button>
            <FormText color="muted">
              Once you create the survey, the transaction will be mined and new
              survey contract will be deployed.
            </FormText>
          </FormGroup>
        </Form>
        <h3> Contract Calls </h3>
        <p>Javascript calls being made: </p>
        {this.state.logs.map((item, i) => (
          <div key={i} className="logs">
            <p>{item}</p>
          </div>
        ))}
      </React.Fragment>
    );
  }
}

export default SurveyMarketPlace;
