/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-waffle");
const {API_URL_ROPSTEN, API_URL_RINKEBY, PRIVATE_KEY} = process.env;
module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {},
    ropsten: {
      url: API_URL_ROPSTEN,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    rinkeby: {
      url: API_URL_RINKEBY,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
