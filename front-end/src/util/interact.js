require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey); 

const contractABI = require("../contract-abi.json");
const contractAddress = "0x928D2Dc6E18b72EcCFfa3Eb48d56c8D66C86db74";

export const lotteryContract = new web3.eth.Contract(
    contractABI.abi,
    contractAddress
);

export const loadCurrentMessage = async () => { 
  
};

export const connectWallet = async () => {
  
};

export const getCurrentWalletConnected = async () => {
  
};

export const updateMessage = async (address, message) => {
  
};