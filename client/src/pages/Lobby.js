//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import { Link } from "react-router-dom";
import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import LobbyRoom from '../components/LobbyRoom';

const Lobby = () => {
    return (
        //<Router>
            <div className="container">
                <LobbyRoom />
            </div>

        //</Router>
    )
}

export default Lobby