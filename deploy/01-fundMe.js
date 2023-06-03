const { network } = require("hardhat");
const { networkconfiguration, developmentNetworks } = require("../helper-hardhat-config");
const verify = require("../utils/verify");

module.exports = async ({ deployments, getNamedAccounts }) => {
   const { log, deploy } = deployments;
   const { deployer } = await getNamedAccounts();
   const chainId = network.config.chainId;
   const networkName = network.name;
   let ethPriceFeedAddress;
   if (chainId == 31337) {
      const mockContract = await deployments.get("MockV3Aggregator");
      ethPriceFeedAddress = mockContract.address;
   } else if (networkconfiguration[chainId]) {
      ethPriceFeedAddress = networkconfiguration[chainId].priceFeedAddress;
   }
   log("deploying FundMe and wait for the confirmation");
   const fundMeContract = await deploy("FundMe", {
      from: deployer,
      args: [ethPriceFeedAddress],
      log: true,
      waitConfirmations: network.config.blockConfirmation || 1,
   });
   log("-----------------------------------------------------");

   if (!developmentNetworks.includes(networkName) && process.env.ETHERSCAN_API_KEY) {
      log("verifying FundMe smart contract");
      await verify(fundMeContract.address, [ethPriceFeedAddress]);
      log("-----------------------------------------------------");
   }
};

module.exports.tags = ["all", "fundMe"];
