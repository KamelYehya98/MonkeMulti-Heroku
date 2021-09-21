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
import chatIcon from '../img/chat_icon.svg';
import './css/Chat.css';
//import './css/Game.css';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function Room() {
    const socket = sok.getSocket();
    const history = useHistory();

    async function submitToDatabase(e){
        // e.preventDefault();
        // let user1 = 'taftaf', user2 = 'hasagi';
        // let score1 = Monke.Player1.calculateScore();
        // let score2 = Monke.Player2.calculateScore();
        // try{
        //     console.log('Reacccccccccccccccched submitting scores to db');
        //       const res = await fetch(`${SERVER_URL}/creatematchhistory`, {
        //           method: 'POST',
        //           body: JSON.stringify({ user1, user2, score1, score2 }),
        //           headers: { 'Content-Type' : 'application/json' },
        //           credentials: 'include'
        //       });          
        //   }catch(err){
        //       console.log(err);
        //   }
    }

    const unlisten = history.listen (location => {
        console.log("Dahar mnil room");
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

        if(Monke.Player1.BlockAction)
            return;
        if(Monke.Player1.Turn && id !== '1')
            return;
        if(Monke.Player1.Turn==false && e.target.getAttribute("id")[0] == 'f' && id !== "1")
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
            default: console.log("Aklna khara.............."); break;
        }
        
    }

    return (
        <Router>
            <div className="d-flex justify-content-center align-items-center w-100" id="themaincontainer">
                <button id="showHideChat">
                    <img src={chatIcon} alt="chat" />
                </button>
                <ChatBox/>  
                <div className="container w-100">
                    <form onSubmit={submitToDatabase} hidden>
                        <input type='submit' id='formBtn'/>
                    </form>
                    <Route exact>
                        <div>
                            <center><h1 className="w-100" id="wait">WAITING FOR PLAYRE 2</h1></center>
                        </div>
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

export default Room;
