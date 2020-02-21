import React, { Component } from "react";
import Web3 from "web3";
import AsymmetricKeyConfig from "./AsymmetricKeyConfig";
import SymmetricKeyConfig from "./SymmetricKeyConfig";
import { decodeFromHex, encodeToHex } from "./hexUtils";
import "./App.css";

const defaultRecipientPubKey =
  "0x04ffb2647c10767095de83d45c7c0f780e483fb2221a1431cb97a5c61becd3c22938abfe83dd6706fc1154485b80bc8fcd94aea61bf19dd3206f37d55191b9a9c4";
const defaultTopic = "0x5a4ea131";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgs: [],
      text: "",
      symKeyId: null,
      name: "",
      asymKeyId: null,
      sympw: "",
      asym: true,
      configured: false,
      topic: defaultTopic,
      recipientPubKey: defaultRecipientPubKey,
      asymPubKey: ""
    };
  }

  componentDidMount() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider("http://0.0.0.0:8545")
    );
    this.shh = this.web3.shh;
    this.shh
      .newKeyPair()
      .then(id => {
        this.setState({ asymKeyId: id });
        return this.shh
          .getPublicKey(id)
          .then(pubKey => {
            this.setState({ asymPubKey: pubKey });
          })
          .catch(console.log);
      })
      .catch(console.log);
  }

  sendMessage = () => {
    const { text, name, msgs, topic } = this.state;
    let msg = {
      text,
      name
    };
    msgs.push(msg);
    let postData = {
      ttl: 7,
      topic,
      powTarget: 2.01,
      powTime: 100,
      payload: encodeToHex(JSON.stringify(msg))
    };

    if (this.state.asym) {
      postData.pubKey = this.state.recipientPubKey;
      postData.sig = this.state.asymKeyId;
    } else {
      postData.symKeyID = this.state.symKeyId;
    }

    this.shh.post(postData);

    this.setState({ text: "", msgs });
  };

  updateSymKey = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.shh.generateSymKeyFromPassword(value).then(symKeyId => {
      this.setState({ symKeyId });
    });
  };

  changeInput = () => {
    this.setState({ asym: !this.state.asym });
  };

  handleOnChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  configWithKey = () => {
    // TODO use a form
    const { name, asym, asymKeyId, symKeyId, msgs, topic } = this.state;
    if (!name || name.length === 0) {
      alert("Please pick a username");
      return;
    }

    let filter = {
      topics: [topic]
    };

    if (asym) {
      if (!asymKeyId) {
        alert("No valid asymmetric key");
        return;
      }

      filter.privateKeyID = asymKeyId;
    } else {
      if (!symKeyId || symKeyId.length === 0) {
        alert("please enter a pasword to generate a key!");
        return;
      }

      filter.symKeyID = symKeyId;
    }

    this.msgFilter = this.shh.newMessageFilter(filter).then(filterId => {
      setInterval(() => {
        this.shh.getFilterMessages(filterId).then(messages => {
          for (let msg of messages) {
            let message = decodeFromHex(msg.payload);
            msgs.push({
              name: message.name,
              text: message.text
            });
            this.setState({ msgs });
          }
        });
      }, 1000);
    });

    this.setState({ configured: true });
  };

  render() {
    const {
      configured,
      asymPubKey,
      asym,
      symKeyId,
      asymKeyId,
      msgs,
      name,
      text,
      sympw,
      recipientPubKey
    } = this.state;
    return (
      <div>
        <header className="App-header">Whisper Chat Application Demo</header>
        {configured && (
          <div>
            {asym && (
              <div>
                My public key: {asymPubKey}
                Receipient's public key:{" "}
                <input
                  value={recipientPubKey}
                  name="receipientPubKey"
                  onChange={this.handleOnChange}
                />
              </div>
            )}
            {!asym && <div>key: {symKeyId} </div>}
            {msgs.map((m, index) => (
              <div key={index}>
                <b>{m.name}</b> : {m.text}
              </div>
            ))}
            Please type a message:
            <input value={text} onChange={this.handleOnChange} name="text" />
            <button onClick={this.sendMessage}>Send</button>
          </div>
        )}
        {!configured && (
          <div>
            <input type="checkbox" checked={asym} onChange={this.changeInput} />
            Asymmetric
            <br />
            {asym && (
              <AsymmetricKeyConfig pubKey={asymPubKey} keyId={asymKeyId} />
            )}
            {!asym && (
              <SymmetricKeyConfig
                symKeyId={symKeyId}
                sympw={sympw}
                onChange={this.updateSymKey}
              />
            )}
            Username:{" "}
            <input value={name} onChange={this.handleOnChange} name="name" />
            <br />
            {(asymKeyId || symKeyId) && name && (
              <button onClick={this.configWithKey}>Start</button>
            )}
          </div>
        )}
      </div>
    );
  }
}
