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

async function getRoundsWon(user1, user2) {
    const res = await fetch(`${SERVER_URL}/getRoundsWon`, {
        method: 'POST',
        body: JSON.stringify({ user1, user2 }),
        headers: { 'Content-Type' : 'application/json' },
        credentials: 'include'
    });
    const data = await res.json();
    console.log(`Wins for 1: ${data.player1wins}, Wins for 2: ${data.player2wins}`);
    let win1 = data.player1wins, win2 = data.player2wins, matchCount = data.matchCount;
    let ratrut = [win1, win2, matchCount];
    return ratrut;
}

function Room() {
    const socket = sok.getSocket();
    let room;
    let score1, score2, user1, user2, rounds1, rounds2, matches, nextsPressed = 0, stateOfMatch1 ="", stateOfMatch2 ="";
    const history = useHistory();
    let chatDisabled = true;
    const routerToWelcome = () => {
        window.location.assign('/welcome');
    }

    async function submitToDatabase(e){
        e.preventDefault();
        score1 = Monke.calculateScore();
        score2 = Monke.calculateScoreOpp();
        user1 = Monke.Username;
        user2 = Monke.OppUsername;

        //Display round won prompt

        const moratrat = await getRoundsWon(user1, user2);
        rounds1 = moratrat[0];
        rounds2 = moratrat[1];
        matches = moratrat[2]+1;
        if (score1 > score2) {
            rounds2++;
            stateOfMatch1 = "You Lost The Round...";
            stateOfMatch2 = "You Won The Round!";
        } 
        else if (score1 < score2) {
            rounds1++;
            stateOfMatch1 = "You Won The Round!";
            stateOfMatch2 = "You Lost The Round...";
        }
        else stateOfMatch1 = stateOfMatch2 = "Draw!";
        console.log(`Rounds 1: ${rounds1} Rounds 2: ${rounds2} Matches: ${matches}`);
        document.getElementById("roundsPrompt").classList.remove("d-none");
        document.getElementById("match state").innerHTML = stateOfMatch1;
        document.getElementById('user1details').innerHTML = "Username: " + user1 + "<br/>  Score: " + score1 + "<br/>  Nb Rounds Won: " + rounds1;
        document.getElementById('user2details').innerHTML = "Username: " + user2 + "<br/>  Score: " + score2 + "<br/>  Nb Rounds Won: " + rounds2;
        if (matches === 5 || rounds1 === 3 || rounds2 === 3)
            {
                if (rounds1 > rounds2) {
                    stateOfMatch1 = "You Won The Match!!";
                    stateOfMatch2 = "You Lost The Match..";
                }
                else if (rounds1 < rounds2) {
                    stateOfMatch1 = "You Lost The Match..";
                    stateOfMatch2 = "You Won The Match!!";
                }
                else stateOfMatch1 = stateOfMatch2 = "Draw!";
                document.getElementById("match state").innerHTML = stateOfMatch1;
                document.getElementById("playNext").classList.add("d-none");
                socket.emit('hideRoundButton');
            }
        socket.emit('showRoundPrompt', ({user1, user2, score1, score2, rounds1, rounds2, stateOfMatch2}));

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
        if (!location.pathname.includes('room')) {
            console.log("Exited lobby");
            socket.emit('exitRoom');
            unlisten();
        }
    });

    function playerAction(e){
        Monke.playerAction(e.target);
        console.log("BATATAAAAAAAAAAAAAAA");
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

    const routerToRoom = () => {
        history.push('/room');
    }

    async function createRoom(){
        try{
            console.log('Reacccccccccccccccched creating room');
              const res = await fetch(`${SERVER_URL}/createroom`, {
                  method: 'POST',
                  headers: { 'Content-Type' : 'application/json' },
                  credentials: 'include'
              });
              const data = await res.json();
              room = data.roomID;
              console.log(`New room data is ${data.roomID}`);
              socket.emit('join room', data.roomID, (err) => {
                routerToRoom();
              });
          }catch(err){
              console.log(err);
          }
    }

    async function joinRoom(roomid) {
        try{
            console.log('Reacccccccccccccccched joining room');
              const res = await fetch(`${SERVER_URL}/joinroom`, {
                  method: 'POST',
                  body: JSON.stringify({ roomid }),
                  headers: { 'Content-Type' : 'application/json' },
                  credentials: 'include'
              });
              socket.emit('join room', roomid, (err) => {
                if (err) {
                    console.log("What it do error man");
                    return;
                }
                routerToRoom();
            });
            }catch(err) {

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
        routerToWelcome();
        document.getElementById("roundsPrompt").classList.add("d-none");
    }

    function reloadComponents(){
        for (var i = 0; i < 4; i++) {
            let parent = document.getElementById("1" + i);
            if (parent)
                parent.removeChild(parent.firstChild);
        }
        
        
        for (i = 0; i < 4; i++) {
            let parent = document.getElementById("2" + i);
            if (parent)
                parent.removeChild(parent.firstChild);
        }
        
        let img, parent;
        for(i=0; i<4; i++)
        {
            parent = document.getElementById("2" + i);
            console.log(parent);
            img = document.createElement('img');
            img.setAttribute("src", "");
            img.classList.add('img-fluid', 'image-player2');
            img.setAttribute('index', ""+i);
            img.setAttribute('player', ""+2);

            img.addEventListener("click", playerAction);

            if(parent == null){
                parent = document.createElement("div");
                parent.classList.add('col-md-3', 'col-2', 'd-flex', 'justify-content-center', 'flex-column', 'image');
                parent.id = "2" + i;
                parent.appendChild(img);
                document.getElementById('cards-container-player2').appendChild(parent);
                console.log(parent + " newwwwwww");
            }else{
                parent.appendChild(img);
                console.log(parent);
            }

        }

        for(i=0; i<4; i++)
        {
            parent = document.getElementById("1" + i);

            console.log(parent);
            img = document.createElement('img');
            img.setAttribute("src", "");
            img.classList.add('img-fluid', 'image-player1');
            img.setAttribute('index', ""+i);
            img.setAttribute('player', ""+1);

            img.addEventListener("click", playerAction);
            
            if(parent == null){
                parent = document.createElement("div");
                parent.classList.add('col-md-3', 'col-2', 'd-flex', 'justify-content-center', 'flex-column', 'image');
                parent.id = '1' + i;
                parent.appendChild(img);
                document.getElementById('cards-container-player1').appendChild(parent);
                console.log(parent + " newwwwwww");
            }else{
                console.log(parent);
                parent.appendChild(img);
            }
        }
    }

    function nextRound() {
        console.log("Pressed next round");
        document.getElementById("playNext").classList.add("opaque");
        let first = false;
        socket.emit('nextPressed');
        nextsPressed++;
        console.log("Next presSEDDEDEDD: " + nextsPressed);
        if (nextsPressed === 1) {
            first = true;
            console.log(`First is ${first}`);
        }
        if (nextsPressed === 2)
            {
                document.getElementById("roundsPrompt").classList.add("d-none");
                console.log("Starting next round!");
                createRoom();
                reloadComponents();
                document.getElementById("playNext").classList.remove("opaque");
                socket.emit('nextRound', (room));
                Monke.nextRound(first);
                //window.location.assign('/room');
            }
    }

    socket.on('showRoundPrompt', (obj) => {
        document.getElementById("roundsPrompt").classList.remove("d-none");
        stateOfMatch1 = obj.stateOfMatch2;
        document.getElementById("match state").innerHTML = stateOfMatch1;
        document.getElementById('user1details').innerHTML = "Username: " + obj.user1 + "<br/>  Score: " + obj.score1 + "<br/>  Nb Rounds Won: " + obj.rounds1;
        document.getElementById('user2details').innerHTML = "Username: " + obj.user2 + "<br/>  Score: " + obj.score2 + "<br/>  Nb Rounds Won: " + obj.rounds2;
    });

    socket.on('hideRoundButton', () => {
        document.getElementById("playNext").classList.add("d-none");
    });

    socket.on('nextPressed', () => {
        nextsPressed++;
    });

    socket.on('nextRound', (roomid) => {
        console.log("2inno fet fiya lal socket next round");
        document.getElementById("roundsPrompt").classList.add("d-none");
        joinRoom(roomid);
        reloadComponents();
        document.getElementById("playNext").classList.remove("opaque");
        Monke.nextRound(true);
        //window.location.assign('/room');
    });


    return (
        <Router>
            <div className="mt-2 d-flex justify-content-center align-items-center w-100" id="themaincontainer">
                <audio id="monkesound" src={monkeAudio}></audio>
                
                <div className="next-round d-none"  id="roundsPrompt">
                    <h1 id ="match state">{stateOfMatch1}</h1>
                    <div className="d-flex justify-content-evenly">
                        <p className="me-5" id='user1details'></p>
                        <p className="ms-5" id='user2details'></p>
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