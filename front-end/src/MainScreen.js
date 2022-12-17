import React from "react";
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

const LotteryScreen = () => {
  //state variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("No connection to the network."); //default message
  const [newMessage, setNewMessage] = useState("");

  const [hide, setHide] = useState(true);

  const navigate = useNavigate();

  const navigateToAdminScreen = () => {
    navigate('/adminScreen', {replace: true});
  };

  //called only once
  useEffect(() => {
    
  }, []);

  function addSmartContractListener() { //TODO: implement
    
  }

  function addWalletListener() { //TODO: implement
    
  }

  const connectWalletPressed = async () => { //TODO: implement
    
  };

  const onUpdatePressed = async () => { //TODO: implement
    
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

      <h2 style={{ paddingTop: "25px" }}>Current Pot: <b>{message}</b></h2>

      <div style={{ paddingTop: "18px" }}>
        <h3 style={{ display: "inline" }}>Tickets amount: </h3>
        <p style={{ display: "inline" }}>{message}</p>
      </div>

      <div style={{ paddingTop: "18px" }}>
        <h3 style={{ display: "inline" }}>Initial date: </h3>
        <p style={{ display: "inline" }}>{message}</p>
      </div>

      <div style={{ paddingTop: "18px" }}>
        <h3 style={{ display: "inline" }}>Ending date: </h3>
        <p style={{ display: "inline" }}>{message}</p>
      </div>

      <div style={{ paddingTop: "18px", marginBottom: "35px" }}>
        <h3 style={{ display: "inline" }}>Price: </h3>
        <p style={{ display: "inline" }}>{message}</p>
      </div>

      <div>
        <p id="status">{status}</p>

        <button id="buyTicket" onClick={onUpdatePressed}>
          Buy Ticket
        </button>

        <button id="endLottery" className="buttonRight" onClick={onUpdatePressed}>
          End Lottery
        </button>
      </div>

      <div className="middleDiv">
        <button className={ hide?"itemInTheMiddle":"hideButton itemInTheMiddle" } id="adminSettings" onClick={navigateToAdminScreen}>
          Admin Settings
        </button>
      </div>
    </div>
  );
};

export default LotteryScreen;