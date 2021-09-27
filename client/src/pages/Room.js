<<<<<<< Updated upstream
import React from 'react'
=======
import 'bootstrap/dist/css/bootstrap.min.css';
import Monke from '../game_classes/Monke';
import Player1 from '../components/Player1';
import Player2 from '../components/Player2';
import Ground from '../components/Ground';
import MonkeEffect from '../components/MonkeEffect';
import SERVER_URL from "../constants";
import { useHistory } from "react-router-dom";
import sok from "../services/socket";
import ChatBox from '../components/ChatBox';
import chatIcon from '../img/chat_icon_new.svg';
import './css/Chat.css';
import { BrowserRouter as Router, Route } from "react-router-dom";


async function getLatestRoundWinner(){
    let username1 = Monke.Username;
    let username2 = Monke.OppUsername;

    console.log("user1: " + username1);
    console.log("user2: " + username2);
    try{
        console.log('Reacccccccccccccccched getting latest round winner');
        const res = await fetch(`${SERVER_URL}/getlatestroundresult`, {
            method: 'POST',
            body: JSON.stringify({ user1: username1, user2: username2}),
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include'
        });
        const data = await res.json();

        console.log("DAATTTTTAAAAAAAAA FRROOM LAST ROOOOOUND ISSSSS: " + data);
        if(data.res == username1){
            Monke.Player1.NbCardsView = 3;
            Monke.Player2.NbCardsView = 1;
        }else if(data.res == username2){
            Monke.Player1.NbCardsView = 1;
            Monke.Player2.NbCardsView = 3;
        }else{
            Monke.Player1.NbCardsView = 2;
            Monke.Player2.NbCardsView = 2;
        }
        console.log(`${username1} cards to view: ${Monke.Player1.NbCardsView}`);
        console.log(`${username2} cards to view: ${Monke.Player2.NbCardsView}`);
        
    }catch(err){
        console.log(err);
    }
}

function Room() {

    const socket = sok.getSocket();
    const history = useHistory();
    let chatDisabled = true;
    const routerToRoom = () => {
        history.push('/welcome');
    }

    async function submitToDatabase(e){
        e.preventDefault();
        let score1 = Monke.calculateScore();
        let score2 = Monke.calculateScoreOpp();
        let user1 = Monke.Username;
        let user2 = Monke.OppUsername;
        console.log('IN SUBMITTING TO DATABASE INSIDE ROOM: ');
        console.log(score1 + " :" + score2 + ": " + user1 + " :" + user2);

        console.log('Reacccccccccccccccched submitting scores to db');
        await fetch(`${SERVER_URL}/creatematchhistory`, {
            method: 'POST',
            body: JSON.stringify({ user1, user2, score1, score2 }),
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include'
        });
        routerToRoom();
    }

    const unlisten = history.listen (location => {
        console.log("Exited room");
        socket.emit('exitRoom');
        unlisten();
    });

    function playerAction(e){
        Monke.playerAction(e.target);
    }

    function CallButtons(e){
        
        console.log("Entered Call Buttons Before Return.......");
        let id = e.target.getAttribute("id")[e.target.getAttribute("id").length - 1];
        console.log("Att id is: " + id);

        if(Monke.Player1.BlockAction || Monke.didViewCards() == false)
            return;
        if(Monke.Player1.Turn && id !== '1')
            return;
        if(Monke.Player1.Turn == false && e.target.getAttribute("id")[0] == 'f' && id !== "1")
            return;

        console.log("Entered Call Buttons.......");

        switch(e.target.getAttribute("id")[0])
        {
            case "t": Monke.throwCard(); break;
            case "f": Monke.freeThrow(); break;
            case "s": Monke.specialplayer(); break;
            case "m": Monke.monke(); break;
            case "e": 
                    console.log("Executing EndTurn........");
                    Monke.endTurn();
                    break;
            default: console.log("Button not responding.............."); break;
        }
        
    }

    function showHide() {
        if (!chatDisabled) {
            chatDisabled = true;
            document.getElementById("chatBox").classList.add("d-none");

        }
        else {
            if(document.getElementById("showHideChat").classList.contains("message-received")){
                document.getElementById("showHideChat").classList.remove("message-received");
            }
            chatDisabled = false;
            document.getElementById("chatBox").classList.remove("d-none");
        }
    }

>>>>>>> Stashed changes

const Room = () => {
    return (
        <div className="container">
            <div className="d-flex align-items-between">

                <div className="game">
                    <div className="opponent-cards">
                    </div>
    
                    <div className="middle">
                    </div>
    
                    <div className="my-cards">
                    </div>
                </div>

                <div className="controls">
                    <div className="next-card">
                    </div>
    
                    <div className="buttons">
                    </div> 
                </div>

                <div className="chat">
                </div>

            </div>
        </div>
    )
}

export default Room