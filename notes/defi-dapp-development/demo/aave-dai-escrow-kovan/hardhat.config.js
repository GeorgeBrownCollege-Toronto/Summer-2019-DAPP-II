require("@nomiclabs/hardhat-waffle");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config()

module.exports = {
  solidity: "0.7.5",
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: 11395144
      }
    }
  },
  paths: {
    artifacts: "./app/artifacts",
  }
};

