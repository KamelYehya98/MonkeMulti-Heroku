import 'bootstrap/dist/css/bootstrap.min.css';
import Monke from '../game_classes/Monke';
import Player1 from '../components/Player1';
import Player2 from '../components/Player2';
import Ground from '../components/Ground';
import MonkeEffect from '../components/MonkeEffect';
import SERVER_URL from "../constants";



import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function Room() {

    async function submitToDatabase(e){
        e.preventDefault();
        let user1 = 'taftaf', user2 = 'hasagi';
        let score1 = Monke.Player1.calculateScore();
        let score2 = Monke.Player2.calculateScore();
        try{
            console.log('Reacccccccccccccccched submitting scores to db');
              const res = await fetch(`${SERVER_URL}/creatematchhistory`, {
                  method: 'POST',
                  body: JSON.stringify({ user1, user2, score1, score2 }),
                  headers: { 'Content-Type' : 'application/json' },
                  credentials: 'include'
              });          
          }catch(err){
              console.log(err);
          }
    }
    function playerAction(e){
        let plyr = Monke.Player1.Turn == true ? Monke.Player1 : Monke.Player2;
        Monke.playerAction(e.target, plyr);
    }

    function CallButtons(e){
        let Identifier = e.target.getAttribute("id")[e.target.getAttribute("id").length - 1];
        let player = Identifier == "1" ? Monke.Player1 : Monke.Player2;

        let turn = Monke.Player1.Turn === true ? 1 : 2;
        if(turn != Identifier) //Might change it for FreeThrow when it's online (Free throw stops registering when it's not your turen {makes no sense})
            return;
        //possible fix: 
        //add && e.target.getAttribute("id")[0] != 'f' to check that the action isn't free throw
        //then make a condition on card selected (should be opp card if (turn != Identifier))
        switch(e.target.getAttribute("id")[0])
        {
            case "t": player.throwCard(); break;
            case "f": player.freeThrow(); break;
            case "s": player.specialplayer(); break;
            case "m": player.monke(); break;
            case "e": player.endTurn(); break;
            default: console.log("Aklna khara.............."); break;
        }
    }

    setTimeout(Monke.startGame, 1000);

    return (
        <Router>
            <div className="d-flex justify-content-center align-items-center w-100" id="themaincontainer">
                <div className="container w-100">  
                    <form onSubmit={submitToDatabase} hidden>
                        <input type='submit' id='formBtn'/>
                    </form>
            
                    <Route exact>
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
