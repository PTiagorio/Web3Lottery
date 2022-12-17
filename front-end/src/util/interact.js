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

export const loadCurrentLottery = async () => { 
    const lottery = await lotteryContract.methods.Lottery().call();
    return lottery;
};

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
        const addressArray = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        const obj = {
            address: addressArray[0],
        };
        return obj;
        } catch (err) {
        return {
            address: "",
            status: "😥 " + err.message,
        };
        }
    } else {
        return {
        address: "",
        status: (
            <span>
            <p>
                {" "}
                🦊{" "}
                <a target="_blank" href={`https://metamask.io/download`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
                </a>
            </p>
            </span>
        ),
        };
    }
};

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
        const addressArray = await window.ethereum.request({
            method: "eth_accounts",
        });
        if (addressArray.length > 0) {
            return {
            address: addressArray[0],
            };
        } else {
            return {
            address: "",
            status: "🦊 Connect to Metamask using the top right button.",
            };
        }
        } catch (err) {
        return {
            address: "",
            status: "😥 " + err.message,
        };
        }
    } else {
        return {
        address: "",
        status: (
            <span>
            <p>
                {" "}
                🦊{" "}
                <a target="_blank" href={`https://metamask.io/download`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
                </a>
            </p>
            </span>
        ),
        };
    }
};

export const endLottery = async (address) => {
    sendTransaction(address, lotteryContract.methods.endLottery().encodeABI());
}

export const startLottery = async (address, amountOfDays, ticketPrice) => {
    sendTransaction(address, lotteryContract.methods.startLottery(amountOfDays, ticketPrice).encodeABI());
}

export const buyTicket = async (address) => {
    sendTransaction(address, lotteryContract.methods.buyTicket().encodeABI());
}

export const withdrawFees = async (address) => {
    sendTransaction(address, lotteryContract.methods.withdrawFees().encodeABI());
}

export const changeTicketPrice = async (address, ticketPrice) => {
    sendTransaction(address, lotteryContract.methods.changeTicketPrice(ticketPrice).encodeABI());
}

export const cancelLottery = async (address) => {
    sendTransaction(address, lotteryContract.methods.cancelLottery().encodeABI());
}

export const retrySubmissionOfFounds = async (address) => {
    sendTransaction(address, lotteryContract.methods.retrySubmissionOfFounds().encodeABI());
}

export const sendTransaction = async (address, dataMethod) => {

    //input error handling
    if (!window.ethereum || address === null) {
      return {
        status:
          "💡 Connect your Metamask wallet to update the message on the blockchain.",
      };
    }
  
    //set up transaction parameters
    const transactionParameters = {
      to: contractAddress, // Required except during contract publications.
      from: address, // must match user's active address.
      data: dataMethod,
    };
  
    //sign the transaction
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      return {
        status: (
          <span>
            ✅{" "}
            <a target="_blank" href={`https://goerli.etherscan.io/tx/${txHash}`}>
              View the status of your transaction on Etherscan!
            </a>
            <br />
            ℹ️ Once the transaction is verified by the network, the message will
            be updated automatically.
          </span>
        ),
      };
    } catch (error) {
      return {
        status: "😥 " + error.message,
      };
    }
  };