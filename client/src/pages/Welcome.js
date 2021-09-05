//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import { Link } from "react-router-dom";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Welcome.css';
import Greetings from '../components/Greetings';
import CreateRoom from '../components/CreateRoom';
import JoinRoom from '../components/JoinRoom';
import PlayerStats from '../components/PlayerStats';
import Test from '../components/Test';

const Welcome = ({username}) => {
    console.log("username is: " + {username});

    async function checkUser(){
        try{
            console.log('Reacccccccccccccccched getting GET requests');
            const res = await fetch('checkuser', {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                credentials: 'include'
            });
            //setUsername( await res.json() );
            // if(user)
            //     console.log("The goddamn use is: " + user.username);
            // else
            //     console.log("There is no user token");
        }catch(err){
            console.log(err);
        }
    }
    checkUser();
    return (
        //<Router>
            <div className="container">

                <div className="row d-flex flex-no-wrap flex-md-row flex-column">
                    <Greetings username={username}/>
                    <CreateRoom />
                    <JoinRoom />
                    <PlayerStats username={username} />
                    <Test />
                </div>
            </div>
            //<Switch>
            //</Switch>
        //</Router>
    )
}

export default Welcome