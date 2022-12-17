import React from "react";
import moment from 'moment';
import { useEffect, useState } from "react";
import {
  lotteryContract,
  connectWallet,
  getCurrentWalletConnected,
  loadCurrentLottery,
} from "./util/interact.js";

import lottoLogo from "./lottoLogo.svg";

import { useNavigate, Link } from 'react-router-dom';

const LotteryScreen = () => {
  //state variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("No connection to the network."); //default message
  const [newMessage, setNewMessage] = useState("");

  const [currentPot, setCurrentPot] = useState("");
  const [ticketsAmount, setTicketsAmount] = useState("");
  const [initialDate, setInitialDate] = useState("");
  const [amountOfDays, setAmountOfDays] = useState("");
  const [ticketsPrice, setTicketsPrice] = useState("");

  const [contractOwner, setContractOwner] = useState("");
  const [dontHide, setDontHide] = useState(true);

  const navigate = useNavigate();

  const navigateToAdminScreen = () => {
    navigate('/adminScreen', {replace: true});
  };

  async function fetchLottery() {
    const lottery = await loadCurrentLottery();

    var formatted;
    if(lottery.startingTimestamp == 0) {
      formatted = "None";
    }
    else {
      var t = new Date(lottery.startingTimestamp);
      formatted = moment(t).format("DD/MM/yyyy hh:mm:ss");
    }

    setCurrentPot(lottery.potAmount == 0 ? "None" : lottery.potAmount);
    setTicketsAmount(lottery.ticketsAmount == 0 ? "None" : lottery.ticketsAmount);
    setInitialDate(formatted);
    setAmountOfDays(lottery.amountOfDays == 0 ? "None" : lottery.amountOfDays);
    setTicketsPrice(lottery.ticketPrice == 0 ? "None" : lottery.ticketPrice);
  }

  //called only once
  useEffect(() => {
    fetchLottery();
    addSmartContractListener();
  
    async function fetchWallet() {
      const {address, status} = await getCurrentWalletConnected();
      setWallet(address)
      setStatus(status); 
    }
    fetchWallet();
    addWalletListener(); 
  }, []);

  function addSmartContractListener() {
    lotteryContract.events.StartedEndLotteryProcessEvent({}, (error, data) => {
      fetchLottery();
    });

    lotteryContract.events.EndedEndLotteryProcessEvent({}, (error, data) => {
      fetchLottery();
    });

    lotteryContract.events.StartedLotteryEvent({}, (error, data) => {
      fetchLottery();
    });

    lotteryContract.events.TicketBoughtEvent({}, (error, data) => {
      fetchLottery();
    });

    lotteryContract.events.FeesWithdrewEvent({}, (error, data) => {
      fetchLottery();
    });

    lotteryContract.events.TicketPriceChangedEvent({}, (error, data) => {
      fetchLottery();
    });

    lotteryContract.events.LotteryCanceledEvent({}, (error, data) => {
      fetchLottery();
    });

    lotteryContract.events.SubmissionOfFoundsRetriedEvent({}, (error, data) => {
      fetchLottery();
    });
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
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

  const onBuyTicketPressed = async () => { //TODO: implement
    
  };

  const onBuyEndLotteryPressed = async () => { //TODO: implement
    
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

      <p id="status">{status}</p>

      <h2 style={{ paddingTop: "25px" }}>Current Pot: <b>{currentPot}</b></h2>

      <div style={{ paddingTop: "18px" }}>
        <h3 style={{ display: "inline" }}>Tickets amount: </h3>
        <p style={{ display: "inline" }}>{ticketsAmount}</p>
      </div>

      <div style={{ paddingTop: "18px" }}>
        <h3 style={{ display: "inline" }}>Initial date: </h3>
        <p style={{ display: "inline" }}>{initialDate}</p>
      </div>

      <div style={{ paddingTop: "18px" }}>
        <h3 style={{ display: "inline" }}>Amount of Days available: </h3>
        <p style={{ display: "inline" }}>{amountOfDays}</p>
      </div>

      <div style={{ paddingTop: "18px", marginBottom: "35px" }}>
        <h3 style={{ display: "inline" }}>Price: </h3>
        <p style={{ display: "inline" }}>{ticketsPrice}</p>
      </div>

      <div>
        <button id="buyTicket" onClick={onUpdatePressed}>
          Buy Ticket
        </button>

        <button id="endLottery" className="buttonRight" onClick={onUpdatePressed}>
          End Lottery
        </button>
      </div>

      <div className="middleDiv">
        <button className={ dontHide?"itemInTheMiddle":"hideButton itemInTheMiddle" } id="adminSettings" onClick={navigateToAdminScreen}>
          Admin Settings
        </button>
      </div>
    </div>
  );
};

export default LotteryScreen;