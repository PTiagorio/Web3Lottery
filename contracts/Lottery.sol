// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "../contracts/Owner.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";


contract LotteryContract is Owner, VRFV2WrapperConsumerBase, ConfirmedOwner {

    // ---------- VARIABLES, MAPPINGS AND MODIFIERS: ----------

    // TODO: since it's a sctructure, the uints should be set smaller than uint256 when possible
    struct LotteryStruct {
        uint ticketPrice;
        uint ticketsAmount;
        uint lotteryDays;
        uint lotteryPot;
        uint startingTimestamp;
    }

    LotteryStruct public Lottery;

    uint feesToWithdraw;

    mapping (uint => address payable) public ticketToOwner;
    address [] lotteryBuyers;

    address [] notRefoundedBuyers;

    // checks if there is a lottery still active by comparing timestamps
    modifier isLotteryActive() {
        require(
            (Lottery.startingTimestamp != 0) &&
            (((block.timestamp - Lottery.startingTimestamp) / 60 / 60 / 24) < Lottery.lotteryDays),
            "No lottery running"
        );
        _;
    }

    // checks if there isn't another lottery still active by comparing timestamps
    modifier isLotteryInactive() {
        require(
            (Lottery.startingTimestamp == 0) ||
            (((block.timestamp - Lottery.startingTimestamp) / 60 / 60 / 24) >= Lottery.lotteryDays),
            "A lottery is stil running"
        );
        _;
    }

    // ---------- CHAINLINK FUNCTIONS AND VARIABLES: ----------

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 100000;
    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;
    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFV2Wrapper.getConfig().maxNumWords.
    uint32 numWords = 1;
    // Address LINK - hardcoded for Goerli
    address linkAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    // address WRAPPER - hardcoded for Goerli
    address wrapperAddress = 0x708701a1DfF4f478de54383E49a627eD4852C816;
    // 
    uint256 public randomResult;

    constructor() 
        ConfirmedOwner(msg.sender)
        VRFV2WrapperConsumerBase(linkAddress, wrapperAddress) 
    {}

    // ends the lottery by calling the winner
    function endLottery() public isLotteryInactive returns (uint256 requestId) {
        require(Lottery.lotteryPot > 0, "There is no pot to claim");
        return requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords
        );
    }

    // this function is called by the oracle and sends the founds of the lottery to the winner, less a 2% fee
    // this function is secured by the VRFV2WrapperConsumerBase contract, and as such can't be called by malicious actors
    function fulfillRandomWords(uint256 /*requestId*/, uint256[] memory randomness) internal virtual override  {
        randomResult = randomness[0] % (Lottery.ticketsAmount);
        ticketToOwner[randomResult].transfer(Lottery.lotteryPot - (Lottery.lotteryPot * 2 / 100));
        Lottery.lotteryPot = 0;
    }

    // ---------- HAPPY FLOW: ----------

    // starts a lottery
    function startLottery(uint _lotteryDays, uint _ticketPrice) external isOwner isLotteryInactive {
        require(Lottery.lotteryPot == 0);
        // ticket price in Wei
        Lottery.ticketPrice = _ticketPrice;
        Lottery.ticketsAmount = 0;
        Lottery.lotteryDays = _lotteryDays;
        Lottery.startingTimestamp = block.timestamp;
    }

    // buys a lottery ticket
    function buyTicket() payable external isLotteryActive returns(uint) {
        require(msg.value == Lottery.ticketPrice);
        ticketToOwner[Lottery.ticketsAmount] = payable(msg.sender);
        lotteryBuyers.push(msg.sender);
        Lottery.ticketsAmount++;
        Lottery.lotteryPot += Lottery.ticketPrice;
        console.log("Current pot: ", Lottery.lotteryPot);
        console.log("Created ticket number: ", Lottery.ticketsAmount - 1);
        console.log("Current amount of tickets: ", Lottery.ticketsAmount);
        return Lottery.ticketsAmount;
    }

    function withdrawFees() public isOwner {
        payable(msg.sender).transfer(address(this).balance - Lottery.lotteryPot);
    }
    
    // ---------- EXCEPTION FLOWS: ----------

    // changes the overall price of each ticket, only doable by the Owner
    function changeTicketPrice(uint _ticketPrice) external isOwner isLotteryActive {
        Lottery.ticketPrice = _ticketPrice;
    }

    // cancells a lottery and return part of the funds
    function cancelLottery() external isOwner isLotteryActive {
        for (uint i=0; i<lotteryBuyers.length; i++) {
            (bool sent, ) = lotteryBuyers[i].call{value: Lottery.ticketPrice}("");
            if(!sent) {
                notRefoundedBuyers.push(lotteryBuyers[i]);
            }
            delete ticketToOwner[Lottery.ticketsAmount - 1 - i];
        }
        delete lotteryBuyers;
        Lottery.ticketsAmount = 0;
        Lottery.lotteryDays = 0;
        Lottery.lotteryPot = 0;
        Lottery.startingTimestamp = 0;
    }

    function retrySubmissionOfFounds() external isOwner {
        address [] memory tempNotRefoundedBuyers;
        uint j=0;
        for (uint i=0; i<notRefoundedBuyers.length; i++) {
            (bool sent, ) = notRefoundedBuyers[i].call{value: Lottery.ticketPrice}("");
            if(!sent) {
                tempNotRefoundedBuyers[j] = notRefoundedBuyers[i];
                j++;
            }
        }
        notRefoundedBuyers = tempNotRefoundedBuyers;
    }
}