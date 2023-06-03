const { getNamedAccounts, ethers } = require("hardhat");

async function withdraw() {
   const { deployer } = await getNamedAccounts();
   const fundMe = await ethers.getContract("FundMe", deployer);
   const balance = await fundMe.provider.getBalance(fundMe.address);
   console.log("initial balance is :", ethers.utils.formatEther(balance), "ETH");

   console.log("----------------------------------------------");
   console.log("withdraw the funds");
   const transaction = await fundMe.withdraw();
   transaction.wait(1);
   console.log("withdrawal operation succeded");
   console.log("-----------------------------------------------");
   const finalBalance = await fundMe.provider.getBalance(fundMe.address);
   console.log("the final balance is:", ethers.utils.formatEther(finalBalance), "ETH");
}

withdraw()
   .then((a) => {
      console.log(a);
      process.exit(0);
   })
   .catch((error) => {
      console.log(error);
      process.exit(1);
   });
