const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { developmentNetworks } = require("../../helper-hardhat-config");
const { assert } = require("chai");

developmentNetworks.includes(network.name)
   ? describe.skip
   : describe("FundMe staging test ", async function () {
        let deployer;
        let fundMe;
        const ethAmount = ethers.utils.parseEther("0.1");

        before(async function () {
           deployer = (await getNamedAccounts()).deployer;
           fundMe = await ethers.getContract("FundMe", deployer);
        });

        it("we can fund and withdraw from the fundMe contract ", async function () {
           const fundTransaction = await fundMe.fund({ value: ethAmount });
           await fundTransaction.wait(1);
           let balance = await fundMe.provider.getBalance(fundMe.address);
           assert.equal(ethAmount.toString(), balance.toString());
           const withdrawTransaction = await fundMe.withdraw();
           await withdrawTransaction.wait(1);
           balance = await fundMe.provider.getBalance(fundMe.address);
           assert.equal(balance.toString(), "0");
        });
     });
