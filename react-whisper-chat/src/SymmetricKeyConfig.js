import React, { Component } from "react";

export default class SymmetricKeyConfig extends Component {
  render() {
    const { symKeyId, sympw, onChange } = this.props;
    return (
      <div>
        Key generation password:{" "}
        <input value={sympw} name="sympw" onChange={onChange} />
        <br />
        Symmetric key ID:
        {symKeyId || "Type a password to start generating the key"}
      </div>
    );
  }
}
