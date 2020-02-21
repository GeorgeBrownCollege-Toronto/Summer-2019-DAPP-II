import React, { Component } from 'react';
import { keccak512 } from 'js-sha3';
import CryptoJS from 'crypto-js';
import jc from 'json-cycle';
import * as Ethers from 'ethers';
import './App.css';

const DAPP_STORAGE_KEY = "SIGNTX";
const SIGN_UP_BUTTON = "SIGN UP";
const SIGN_IN_BUTTON = "SIGN IN";

export default class App extends Component {
  state = {
    password: '',
    wallet: undefined,
    buttonName: SIGN_UP_BUTTON,
    isWallet: false,
  }

  handlePasswordChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value })
  }

  componentDidMount() {
    const wallet = window.localStorage.getItem(DAPP_STORAGE_KEY);
    const isWallet = wallet === null || wallet === undefined ? false : true;
    let { buttonName } = this.state;
    if (isWallet) {
      buttonName = SIGN_IN_BUTTON;
    }
    this.setState({ isWallet, buttonName })
  }

  handleClick = () => {
    const { password, isWallet } = this.state;
    const hashKey = keccak512(password);
    const storageObj = window.localStorage;
    if (isWallet) {
      // Decryption
      const decycleEncryptedStore = storageObj.getItem(DAPP_STORAGE_KEY);
      const cyclicCipher = jc.retrocycle(JSON.parse(decycleEncryptedStore));
      const bytes = CryptoJS.AES.decrypt(cyclicCipher, hashKey);
      const plainText = bytes.toString(CryptoJS.enc.Utf8);
      const originalWalletObj = JSON.parse(plainText);
      this.setState({ wallet: originalWalletObj });
    } else {
      const { mnemonic } = Ethers.Wallet.createRandom();
      const originWallet = new Ethers.Wallet.fromMnemonic(mnemonic);
      const wallet = {
        address: originWallet.address,
        privateKey: originWallet.privateKey,
        path: originWallet.path,
        mnemonic: originWallet.mnemonic
      }
      this.setState({ wallet });
      // Encryption
      const encryptedStore = CryptoJS.AES.encrypt(JSON.stringify(wallet), hashKey);
      const decycleEncryptedStore = JSON.stringify(jc.decycle(encryptedStore));
      storageObj.setItem(DAPP_STORAGE_KEY, decycleEncryptedStore);
    }
  }

  render() {
    const { password, buttonName, wallet } = this.state;
    return (
      <div className="App">
        <h1 className="App-header">
          Sample Sign Tx DApp
        </h1>
        {!wallet && (<div><input value={password} type="text" name="password" onChange={this.handlePasswordChange} />
          <button onClick={this.handleClick} >{buttonName}</button></div>)}
        {wallet && (<h1> {`Address : ${wallet.address}`} </h1>)}
      </div>
    )
  }
}