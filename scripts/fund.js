const { getNamedAccounts, ethers } = require("hardhat");
const etherAmount = ethers.utils.parseEther("0.1");

async function fund() {
   const { deployer } = await getNamedAccounts();
   const fundMe = await ethers.getContract("FundMe", deployer);
   console.log("-----------------------------------------------------------");
   console.log("fund the FundMe contract with 0.1 eth");
   const transaction = await fundMe.fund({ value: etherAmount });
   await transaction.wait(1);
   console.log("funded");
   console.log("-----------------------------------------------------------");
}

fund()
   .then(() => {
      process.exit(0);
   })
   .catch((error) => {
      console.log(error);
      process.exit(1);
   });
