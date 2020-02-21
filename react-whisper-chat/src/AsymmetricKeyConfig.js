import React, { Component } from "react";

export default class SymmetricKeyConfig extends Component {
  render() {
    const { keyId, pubKey } = this.props;
    return (
      <div>
        Asymmetric Key id : {keyId} Public key: {pubKey}
      </div>
    );
  }
}
