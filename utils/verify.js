const { run } = require("hardhat");

module.exports = async (contractAdress, args) => {
   try {
      await run("verify:verify", {
         address: contractAdress,
         constructorArguments: args,
      });
   } catch (error) {
      if (error.toLowerCase().includes("already verified")) {
         console.log("contract already verified");
      } else {
         console.log(error);
      }
   }
};
