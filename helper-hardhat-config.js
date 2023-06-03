const networkconfiguration = {
   1: {
      name: "Ethereum Mainnet",
      priceFeedAddress: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
   },
   5: {
      name: "Goerli",
      priceFeedAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
   },
   11155111: {
      name: "Sepolia",
      priceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
   },
};
const developmentNetworks = ["hardhat", "localhost"];
module.exports = { networkconfiguration, developmentNetworks };
