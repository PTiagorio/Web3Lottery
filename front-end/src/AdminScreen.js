import React from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useEffect, useState } from "react";
import {
  lotteryContract,
  connectWallet,
  updateMessage,
  loadCurrentMessage,
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
    
  }, []);

  const navigate = useNavigate();

  function addSmartContractListener() { //TODO: implement
    
  }

  function addWalletListener() { //TODO: implement
    
  }

  const connectWalletPressed = async () => { //TODO: implement
    
  };

  const onUpdatePressed = async () => { //TODO: implement
    
  };

  const Modal = () => (
    <Popup trigger={<button className="button"> Open Modal </button>} modal>
      <span> Modal content </span>
    </Popup>
  );

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
          <button id="startLottery" className="button" onClick={onUpdatePressed}>
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
            <button id="startLottery" className="itemInTheMiddle" onClick={onUpdatePressed}>
              Start Lottery
            </button>
          </div>
        </Popup>

        <button id="withdrawFees" className="buttonRight" onClick={onUpdatePressed}>
          Withdraw Fees
        </button>
      </div>

      <div className="middleDiv">
        <Popup trigger={
          <button id="changeTicketPrice" className="buttonSalmon itemInTheMiddle" onClick={onUpdatePressed}>
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
              <button id="updatePrice" className="itemInTheMiddle" onClick={onUpdatePressed}>
                Update Price
              </button>
            </div>
        </Popup>
      </div>

      <div>
        <button id="cancelLottery" className="buttonRed" onClick={onUpdatePressed}>
            Cancel Lottery
        </button>

        <button id="retrySubmissionOfFounds" className="buttonRight buttonRed" onClick={onUpdatePressed}>
            Retry Submission of Founds
        </button>
      </div>
    </div>
  );
};

export default AdminScreen;