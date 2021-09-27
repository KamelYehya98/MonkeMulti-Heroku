import React from 'react'
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
import monkeAudio from "../audio/MONKE.mp3";


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
    let score1, score2, user1, user2;
    const history = useHistory();
    let chatDisabled = true;
    const routerToRoom = () => {
        history.push('/welcome');
    }

    async function submitToDatabase(e){
        e.preventDefault();
        score1 = Monke.calculateScore();
        score2 = Monke.calculateScoreOpp();
        user1 = Monke.Username;
        user2 = Monke.OppUsername;
        //Display round won prompt
        document.getElementById("roundsPrompt").classList.remove("d-none");
        console.log('IN SUBMITTING TO DATABASE INSIDE ROOM: ');
        console.log(score1 + " :" + score2 + ": " + user1 + " :" + user2);

        console.log('Reacccccccccccccccched submitting scores to db');
        await fetch(`${SERVER_URL}/creatematchhistory`, {
            method: 'POST',
            body: JSON.stringify({ user1, user2, score1, score2 }),
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include'
        });
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

    function leaveMatch() {
        routerToRoom();
        document.getElementById("roundsPrompt").classList.add("d-none");
    }

    function nextRound() {
        Monke = Monke.nextRound();
    }


    return (
        <Router>
            <div className="mt-2 d-flex justify-content-center align-items-center w-100" id="themaincontainer">
                <audio id="monkesound" src={monkeAudio}></audio>
                <div className="next-round" id = "roundsPrompt" class = "d-none">
                    <h1>Rounds Won</h1>
                    <div className="d-flex justify-content-evenly">
                        <p>{user1}: {score1}</p>
                        <p>{user2}: {score2}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button id="leave" onClick={leaveMatch}>Leave</button>
                        <button id="playNext" onClick={nextRound}>Play Next Round</button>
                    </div>
                </div>
                <button id="showHideChat" onClick={showHide}>
                    <img src={chatIcon} alt="chat" />
                </button>
                <ChatBox/>  
                <div className="container w-100 main-container">
                    <form onSubmit={submitToDatabase} hidden>
                        <input type='submit' id='formBtn'/>
                    </form>
                    <Route exact>
                        {/* <div>
                            <center><h1 className="w-100" id="wait">WAITING FOR PLAYRE 2</h1></center>
                        </div> */}
                        <Player2 playerAction={playerAction} CallButtons={CallButtons}/>
                    </Route>

                    <div className="row">
                        <div className="col-12 " id="ground-container">
                                 
                            <Route exact>
                                <Ground playerAction={playerAction}/>
                            </Route>

                            <Route exact component={MonkeEffect} />
                            
                        </div>
                    </div>

                    <Route exact>
                        <Player1 playerAction={playerAction} CallButtons={CallButtons}/>
                    </Route>


                </div>
            </div>
        </Router>
    );


}

export {getLatestRoundWinner};
export default Room;