
# Hardhat Fund Me


This project demonstrates a basic Hardhat use case. It comes with  sample contracts that allow to collect funds and withdraw it by the owner who deployed the contract.You can deploy this contract on sepolia or on your local hardhat node .
<p style='color:blue'>You need first to add these environement variables to your .env file,check the hardhat.config.js file.</p>

```javascript
const sepolia_rpc_url = process.env.SEPOLIA_RPC_URL;
const goerli_private_key1 = process.env.GOERLI_PRIVATE_KEY_1;
const goerli_private_key2 = process.env.GOERLI_PRIVATE_KEY_2;
const etherscan_api_key = process.env.ETHERSCAN_API_KEY;
const localhost_url = process.env.LOCALHOST_RPC_URL;
const gaz_reporter_key = process.env.GAZ_REPORTER_API_KEY;
```
<p style='color:blue'>Then try running these tasks</p>

 * to compile your smart contract
         
```shell
yarn compile 
```

 * to deploy your smart contract on sepolia 
```shell
yarn deploy --network sepolia
```
* run a local node and get all your smart contracts deployed on it
```shell
yarn hardhat node
```
  
* to fund the smart contract 
```shell
yarn fund 
```
* to withdraw the funds from the smart contract 
```shell
yarn withdraw
```



