//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import { Link } from "react-router-dom";
import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import RandomLobbyRoom from '../components/RandomLobbyRoom';

const RandomLobby = () => {
    return (
            <div className="container">
                <RandomLobbyRoom />
            </div>
    )
}

export default RandomLobby;