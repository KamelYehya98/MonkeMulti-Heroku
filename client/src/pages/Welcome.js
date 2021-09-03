//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import { Link } from "react-router-dom";
import React from 'react';

import logo from '../img/MonkeLogo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Welcome.css';
import Greetings from '../components/Greetings';
import CreateRoom from '../components/CreateRoom';
import JoinRoom from '../components/JoinRoom';

const Welcome = () => {
    return (
        //<Router>
            <div className="container">

                <div className="row d-flex flex-no-wrap flex-md-row flex-column">
                    <div className="col-md-6 order-md-0 order-1 left-col">
                        <img src={logo} alt='Monkey Logo'/>
                    </div>

                <Greetings />
                <CreateRoom />
                <JoinRoom />
                </div>
            </div>
            //<Switch>
            //</Switch>
        //</Router>
    )
}

export default Welcome