import Web3 from "web3";
import SurveyFactory from "./contracts/SurveyFactory.json";

const options = {
  web3: {
    block: false,
    // customProvider: new Web3("ws://localhost:8545"),
    customProvider: new Web3(window.web3.currentProvider),
  },
  // syncAlways:true,
  polls: {
    accounts: 2000,
  },
  contracts: [SurveyFactory],
  events: {
    SurveyFactory: ["SurveyFactoryInitialized", "SurveyCreated"],
  },
};

export default options;
