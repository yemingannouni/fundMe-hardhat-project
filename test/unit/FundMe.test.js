const { deployments, getNamedAccounts, ethers, network } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentNetworks } = require("../../helper-hardhat-config");
!developmentNetworks.includes(network.name)
   ? describe.skip
   : describe("FundMe", function () {
        let fundMe, Mock;
        let value = ethers.utils.parseEther("3");
        let deployer;
        let Accounts;

        beforeEach(async function () {
           Accounts = await ethers.getSigners();
           deployer = (await getNamedAccounts()).deployer;
           await deployments.fixture(["all"]);
           fundMe = await ethers.getContract("FundMe", deployer);
           Mock = await ethers.getContract("MockV3Aggregator", deployer);
        });

        describe("constructor", function () {
           it("set the aggregator address to the mock address", async function () {
              const priceFeedAddress = await fundMe.getPriceFeed();
              assert.equal(priceFeedAddress, Mock.address);
           });
        });
        describe("receive", function () {
           it("receive function is executed  when we sent a transaction with  an with emty data", async function () {
              const signers = await ethers.getSigners();
              const transaction = await signers[0].sendTransaction({
                 to: fundMe.address,
                 value: value,
              });
              const contractBalance = await ethers.provider.getBalance(fundMe.address);
              assert.equal(value.toString(), contractBalance.toString());
           });
        });
        describe("fallback", function () {
           it("fallback function is executed when we sent a transaction  an with non empty  data that doesn't match with any function selector", async function () {
              const signers = await ethers.getSigners();
              let value = ethers.utils.parseEther("3");
              const transaction = await signers[0].sendTransaction({
                 to: fundMe.address,
                 value: value,
                 data: "0x1234",
              });

              const contractBalance = await ethers.provider.getBalance(fundMe.address);
              assert.equal(value.toString(), contractBalance.toString());
           });
        });
        describe("Fund", function () {
           it("revert if the amount of ETH sent is not enough", async function () {
              await expect(fundMe.fund()).to.be.revertedWithCustomError(fundMe, "NotEnoughEth");
           });
           it("update the addressToAmountFunded data structure ", async function () {
              await fundMe.fund({ value: value });
              let amountFunded = await fundMe.getAddressToamoutFunded(deployer);
              assert.equal(amountFunded.toString(), value.toString());
           });
           it("add the address of the funder to the funders array", async function () {
              const transaction = await fundMe.fund({ value: value });
              const transactionReceipt = await transaction.wait(1);

              const funder_1 = await fundMe.getFunders(0);
              assert.equal(funder_1, deployer);
           });
        });

        describe("withdraw", function () {
           beforeEach(async function () {
              await fundMe.fund({ value: value });
           });
           it("withdraw ETH from a single account", async function () {
              let deployerStartingBalance = await ethers.provider.getBalance(deployer);
              let fundMeStartingBalance = await ethers.provider.getBalance(fundMe.address);
              let withdrawalTransaction = await fundMe.withdraw();
              let withdrawalReceipt = await withdrawalTransaction.wait(1);
              let amountFundedBytheDeployer = await fundMe.getAddressToamoutFunded(deployer);

              const { gasUsed, effectiveGasPrice } = withdrawalReceipt;
              const gasPrice = gasUsed.mul(effectiveGasPrice);
              let deployerEndingBalance = await ethers.provider.getBalance(deployer);
              let fundMeEndingBalance = await ethers.provider.getBalance(fundMe.address);
              assert.equal(fundMeEndingBalance.toString(), "0");
              assert.equal(amountFundedBytheDeployer, "0");
              assert.equal(
                 gasPrice.toString(),
                 deployerStartingBalance.add(fundMeStartingBalance).sub(deployerEndingBalance)
              );
              await expect(fundMe.getFunders(0)).to.be.reverted;
           });
           it("withdraw from multiple accounts", async function () {
              // Arrange
              for (let i = 1; i < Accounts.length; i++) {
                 let signer = Accounts[i];
                 await fundMe.connect(signer).fund({ value: value });
              }
              const deployerStartingBalance = await ethers.provider.getBalance(deployer);
              const fundMeStartingBalance = await ethers.provider.getBalance(fundMe.address);
              //Act
              const withdrawTransaction = await fundMe.withdraw();
              const withdrawReceipt = await withdrawTransaction.wait(1);
              const { gasUsed, effectiveGasPrice } = withdrawReceipt;
              const gasPrice = gasUsed.mul(effectiveGasPrice);
              const deployerFinalBalance = await fundMe.provider.getBalance(deployer);
              const fundMeFinalBalance = await fundMe.provider.getBalance(fundMe.address);
              assert.equal(fundMeFinalBalance.toString(), "0");
              assert.equal(
                 gasPrice.toString(),
                 deployerStartingBalance.add(fundMeStartingBalance).sub(deployerFinalBalance)
              );
              for (let i = 0; i < Accounts.length; i++) {
                 assert.equal(await fundMe.getAddressToamoutFunded(Accounts[i].address), 0);
              }
              await expect(fundMe.getFunders(0)).to.be.reverted;
           });

           it("only owner can withdraw the funds", async function () {
              let notOwner = Accounts[1];
              console.log("owner_address= ", await fundMe.getOwner());
              let newFundMe = fundMe.connect(notOwner);

              await expect(newFundMe.withdraw()).to.be.revertedWithCustomError(
                 newFundMe,
                 "NotOwner"
              );
           });
        });
        describe("cheaperWithdraw", function () {
           beforeEach(async function () {
              await fundMe.fund({ value: value });
           });
           it("use cheaperwithdraw to withdraw ETH from a single account", async function () {
              let deployerStartingBalance = await ethers.provider.getBalance(deployer);
              let fundMeStartingBalance = await ethers.provider.getBalance(fundMe.address);
              let withdrawalTransaction = await fundMe.cheaperWithdraw();
              let withdrawalReceipt = await withdrawalTransaction.wait(1);
              let amountFundedBytheDeployer = await fundMe.getAddressToamoutFunded(deployer);

              const { gasUsed, effectiveGasPrice } = withdrawalReceipt;
              const gasPrice = gasUsed.mul(effectiveGasPrice);
              let deployerEndingBalance = await ethers.provider.getBalance(deployer);
              let fundMeEndingBalance = await ethers.provider.getBalance(fundMe.address);
              assert.equal(fundMeEndingBalance.toString(), "0");
              assert.equal(amountFundedBytheDeployer, "0");
              assert.equal(
                 gasPrice.toString(),
                 deployerStartingBalance.add(fundMeStartingBalance).sub(deployerEndingBalance)
              );
              await expect(fundMe.getFunders(0)).to.be.reverted;
           });
           it("use cheaperWithdraw from multiple accounts", async function () {
              // Arrange
              for (let i = 1; i < Accounts.length; i++) {
                 let signer = Accounts[i];
                 await fundMe.connect(signer).fund({ value: value });
              }
              const deployerStartingBalance = await ethers.provider.getBalance(deployer);
              const fundMeStartingBalance = await ethers.provider.getBalance(fundMe.address);
              //Act
              const withdrawTransaction = await fundMe.cheaperWithdraw();
              const withdrawReceipt = await withdrawTransaction.wait(1);
              const { gasUsed, effectiveGasPrice } = withdrawReceipt;
              const gasPrice = gasUsed.mul(effectiveGasPrice);
              const deployerFinalBalance = await fundMe.provider.getBalance(deployer);
              const fundMeFinalBalance = await fundMe.provider.getBalance(fundMe.address);
              assert.equal(fundMeFinalBalance.toString(), "0");
              assert.equal(
                 gasPrice.toString(),
                 deployerStartingBalance.add(fundMeStartingBalance).sub(deployerFinalBalance)
              );
              for (let i = 0; i < Accounts.length; i++) {
                 assert.equal(await fundMe.getAddressToamoutFunded(Accounts[i].address), 0);
              }
              await expect(fundMe.getFunders(0)).to.be.reverted;
           });
           it("only owner can  use cheaperWithdraw  to get the funds", async function () {
              let notOwner = Accounts[1];
              let newFundMe = fundMe.connect(notOwner);

              await expect(newFundMe.cheaperWithdraw()).to.be.revertedWithCustomError(
                 newFundMe,
                 "NotOwner"
              );
           });
        });
     });
