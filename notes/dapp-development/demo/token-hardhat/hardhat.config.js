require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.3",
  hardhat: {
  },
  rinkeby: {
    url: "https://eth-mainnet.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",
    accounts: ["privateKey1", "privateKey2"]
  }
};
