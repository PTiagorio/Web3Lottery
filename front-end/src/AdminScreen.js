import React from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useEffect, useState } from "react";
import {
  connectWallet,
  startLottery,
  withdrawFees,
  changeTicketPrice,
  cancelLottery,
  retrySubmissionOfFounds,

  getCurrentWalletConnected,
} from "./util/interact.js";

import lottoLogo from "./lottoLogo.svg";

import { useNavigate, Link } from 'react-router-dom';

const AdminScreen = () => {
  //state variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("No connection to the network."); //default message
  const [newPrice, setNewPrice] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("");

  //called only once
  useEffect(() => {
    addSmartContractListener();
  
    async function fetchWallet() {
      const {address, status} = await getCurrentWalletConnected();
      setWallet(address)
      setStatus(status); 
    }
    fetchWallet();
    addWalletListener(); 
  }, []);

  const navigate = useNavigate();

  function addSmartContractListener() { //TODO: implement
    
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        } else {
          setWallet("");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onUpdatePressed = async () => { //TODO: implement
    
  };
  
  const onStartLotteryPressed = async () => {
    await startLottery(walletAddress, numberOfDays, newPrice);
  };

  const onWithdrawFeesPressed = async () => {
    await withdrawFees(walletAddress);
  };

  const onChangeTicketPricePressed = async () => {
    await changeTicketPrice(walletAddress, newPrice);
  };

  const onCancelLotteryPressed = async () => {
    await cancelLottery(walletAddress);
  };

  const onRetrySubmissionOfFoundsPressed = async () => {
    await retrySubmissionOfFounds(walletAddress);
  };

  //the UI of our component
  return (
    <div id="container">
      <Link to="/">
        <img id="logo" src={lottoLogo}></img>
      </Link>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <div className="block">
        <Popup trigger={
          <button id="startLottery" className="button">
            Start New Lottery </button>
        } modal>
          <div className="middleDiv">
            <input
              className="itemInTheMiddle"
              type="number"
              placeholder="Insert number of days."
              onChange={(e) => setNumberOfDays(e.target.value)}
              value={numberOfDays}
            />
          </div>
          <div className="middleDiv">
            <input
              className="itemInTheMiddle"
              type="number"
              placeholder="Insert tickets price in Wei."
              onChange={(e) => setNewPrice(e.target.value)}
              value={newPrice}
            />
          </div>
          <div className="middleDiv">
            <button id="startLottery" className="itemInTheMiddle" onClick={onStartLotteryPressed}>
              Start Lottery
            </button>
          </div>
        </Popup>

        <button id="withdrawFees" className="buttonRight" onClick={onWithdrawFeesPressed}>
          Withdraw Fees
        </button>
      </div>

      <div className="middleDiv">
        <Popup trigger={
          <button id="changeTicketPrice" className="buttonSalmon itemInTheMiddle">
            Change Ticket Price 
          </button>
        } modal>
            <div className="middleDiv">
              <input
                className="itemInTheMiddle"
                type="number"
                placeholder="Insert new price in Wei."
                onChange={(e) => setNewPrice(e.target.value)}
                value={newPrice}
              />
            </div>
            <div className="middleDiv">
              <button id="updatePrice" className="itemInTheMiddle" onClick={onChangeTicketPricePressed}>
                Update Price
              </button>
            </div>
        </Popup>
      </div>

      <div>
        <button id="cancelLottery" className="buttonRed" onClick={onCancelLotteryPressed}>
            Cancel Lottery
        </button>

        <button id="retrySubmissionOfFounds" className="buttonRight buttonRed" onClick={onRetrySubmissionOfFoundsPressed}>
            Retry Submission of Founds
        </button>
      </div>
    </div>
  );
};

export default AdminScreen;