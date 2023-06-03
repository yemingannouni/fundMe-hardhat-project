const { network } = require("hardhat");

const decimals = 8;
const initialAnswer = 200000000000;

module.exports = async ({ deployments, getNamedAccounts }) => {
   const chainId = network.config.chainId;

   // deploy the mock if we are using the development networks
   if (chainId == 31337) {
      const { log, deploy } = deployments;
      const { deployer } = await getNamedAccounts();
      log("-----------------------------------------------------------");
      log("deploy mocks");
      await deploy("MockV3Aggregator", {
         from: deployer,
         args: [decimals, initialAnswer],
         log: true,
      });

      log("-----------------------------------------------------------");
   }
};

module.exports.tags = ["all", "mocks"];
