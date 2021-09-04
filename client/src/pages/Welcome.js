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