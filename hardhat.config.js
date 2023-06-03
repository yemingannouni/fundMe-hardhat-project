require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");
require("@nomiclabs/hardhat-solhint");

// const goerli_rpc_url = process.env.GOERLI_RPC_URL;
const sepolia_rpc_url = process.env.SEPOLIA_RPC_URL;
const goerli_private_key1 = process.env.GOERLI_PRIVATE_KEY_1;
const goerli_private_key2 = process.env.GOERLI_PRIVATE_KEY_2;
const etherscan_api_key = process.env.ETHERSCAN_API_KEY;
const localhost_url = process.env.LOCALHOST_RPC_URL;
const gaz_reporter_key = process.env.GAZ_REPORTER_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   defaultNetwork: "hardhat",
   networks: {
      // goerli: {
      //    url: goerli_rpc_url,
      //    accounts: [goerli_private_key1, goerli_private_key2],
      //    chainId: 5,
      //    blockConfirmation: 6,
      // },
      localhost: {
         url: localhost_url,
         chainId: 31337,
      },

      sepolia: {
         url: sepolia_rpc_url,
         accounts: [goerli_private_key1, goerli_private_key2],
         chainId: 11155111,
         blockConfirmation: 6,
      },
   },
   solidity: { compilers: [{ version: "0.8.17" }, { version: "0.6.8" }] },
   etherscan: {
      apiKey: etherscan_api_key,
   },
   gasReporter: {
      enabled: true,
      currency: "USD",
      coinmarketcap: gaz_reporter_key,
      token: "ETH",
      noColors: true,
      outputFile: "gas_consumption.txt",
   },
   namedAccounts: {
      deployer: {
         default: 0,
         goerli: 0,
         localhost: 0,
      },
      Aymen: {
         default: 1,
         goerli: 1,
         localhost: 1,
      },
   },
};
