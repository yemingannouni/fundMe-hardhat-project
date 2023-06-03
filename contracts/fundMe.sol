// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";
import "hardhat/console.sol";

error NotOwner();
error NotEnoughEth();

/**
 * @title Funding Contract
 * @author Yemin
 * @notice This contract is made to gather funds for charity
 * @dev this implement PriceConverter as a library
 */
contract FundMe {
   //types declaration
   using PriceConverter for uint256;
   //state variables
   uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
   address private immutable i_owner;
   mapping(address => uint256) private s_addressToamountFund;
   address[] private s_funders;
   AggregatorV3Interface private s_priceFeed;

   //events

   //modifiers
   modifier onlyOwner() {
      // require(msg.sender == owner);
      if (msg.sender != i_owner) revert NotOwner();
      _;
   }

   constructor(address pricefeedAddress) {
      i_owner = msg.sender;
      s_priceFeed = AggregatorV3Interface(pricefeedAddress);
   }

   receive() external payable {
      fund();
   }

   fallback() external payable {
      fund();
   }

   /**
    * @notice Fund our contract with an amount of ETH based on ETH/USD price
    */
   function fund() public payable {
      if (msg.value.getConversionRate(s_priceFeed) <= MINIMUM_USD) revert NotEnoughEth();
      s_addressToamountFund[msg.sender] += msg.value;

      s_funders.push(msg.sender);
   }

   function withdraw() external onlyOwner {
      for (uint256 funderIndex = 0; funderIndex < s_funders.length; funderIndex++) {
         address funder = s_funders[funderIndex];
         s_addressToamountFund[funder] = 0;
      }
      s_funders = new address[](0);
      // // transfer
      // payable(msg.sender).transfer(address(this).balance);
      // // send
      // bool sendSuccess = payable(msg.sender).send(address(this).balance);
      // require(sendSuccess, "Send failed");
      // call
      (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
      require(callSuccess, "Call failed");
   }

   function cheaperWithdraw() external onlyOwner {
      address[] memory funders = s_funders;
      for (uint256 index; index < funders.length; index++) {
         s_addressToamountFund[funders[index]] = 0;
      }
      (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
      require(callSuccess, "Call failed");

      s_funders = new address[](0);
   }

   /**
    * @notice it is used to get the amount that an address has funded
    * @param fundingAddress the address of the funder
    * @return the amount funded
    */
   function getAddressToamoutFunded(address fundingAddress) public view returns (uint256) {
      return s_addressToamountFund[fundingAddress];
   }

   /**
    * @notice it is used to get the address of funders following the chronological order
    * @param index the index of the funder
    * @return the address of the i'th funder
    */
   function getFunders(uint256 index) public view returns (address) {
      return s_funders[index];
   }

   /**
    * @notice it is used to get the owner address
    * @return the owner address
    */
   function getOwner() public view returns (address) {
      return i_owner;
   }

   /**
    * @notice return the address of the contract from which we are getting the price of ETH in ter of dollar
    * @return the s_priceFeed address
    */
   function getPriceFeed() public view returns (AggregatorV3Interface) {
      return s_priceFeed;
   }
}
