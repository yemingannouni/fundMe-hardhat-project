const { getNamedAccounts, ethers } = require("hardhat");

async function storage() {
   const { deployer } = await getNamedAccounts();
   const fundMe = await ethers.getContract("FundMe", deployer);
   let response1 = await fundMe.provider.getStorageAt(fundMe.address, 0);
   console.log("slot0 is ", response1);
   console.log(".......................................................");
   let response2 = await fundMe.provider.getStorageAt(fundMe.address, 1);
   console.log("slot1 is ", response2);
   console.log(".......................................................");
   let response3 = await fundMe.provider.getStorageAt(fundMe.address, 2);
   console.log("slot2 is ", response3);
}

storage()
   .then(() => {
      process.exit(0);
   })
   .catch((error) => {
      console.log(error);
      process.exit(1);
   });
