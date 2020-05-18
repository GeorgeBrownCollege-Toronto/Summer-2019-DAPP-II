import React from "react";
import ReactDOM from "react-dom";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";

import EmbarkJS from "Embark/EmbarkJS";
import SimpleStorageComponent from "./components/SimpleStorageComponent";
import SurveyMarketplaceComponent from "./components/SurveyMarketplaceComponent";

import "bootstrap/dist/css/bootstrap.css";
import "./dapp.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      activeKey: "1",
      simpleStorageEnabled: false,
      surveyMarketplaceEnabled: false,
    };
  }

  componentDidMount() {
    EmbarkJS.onReady((err) => {
      if (err) {
        // If err is not null then it means something went wrong connecting to ethereum
        // you can use this to ask the user to enable metamask for e.g
        return this.setState({ error: err.message || err });
      }

      EmbarkJS.Blockchain.isAvailable().then((result) => {
        this.setState({
          simpleStorageEnabled: result,
          surveyMarketplaceEnabled: result,
        });

        ethereum.on("accountsChanged", function(accounts) {
          EmbarkJS.Blockchain.Providers.web3.setDefaultAccount(accounts[0]);
        });
      });
    });
  }

  _renderStatus(title, available) {
    let className = available
      ? "pull-right status-online"
      : "pull-right status-offline";
    return (
      <React.Fragment>
        {title}
        <span className={className} />
      </React.Fragment>
    );
  }

  handleSelect(key) {
    this.setState({ activeKey: key });
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <div>
            Something went wrong connecting to ethereum. Please make sure you
            have a node running or are using metamask to connect to the ethereum
            network:
          </div>
          <div>{this.state.error}</div>
        </div>
      );
    }
    return (
      <div>
        <h3>Marketplace for survey creators</h3>
        <Nav tabs>
          <NavItem>
            <NavLink
              onClick={() => this.handleSelect("1")}
              className={classnames({ active: this.state.activeKey === "1" })}
            >
              {this._renderStatus(
                "Simple Storage",
                this.state.simpleStorageEnabled
              )}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => this.handleSelect("2")}
              className={classnames({ active: this.state.activeKey === "2" })}
            >
              {this._renderStatus(
                "Survey marketplace",
                this.state.surveyMarketplaceEnabled
              )}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeKey}>
          <TabPane tabId="1">
            <SimpleStorageComponent />
          </TabPane>
          <TabPane tabId="2">
            <SurveyMarketplaceComponent />
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
