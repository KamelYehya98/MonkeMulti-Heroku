//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import { Link } from "react-router-dom";
import React from 'react';
import {useParams} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import LobbyRoom from '../components/LobbyRoom';

const Lobby = () => {
    const { roomID } = useParams();
    console.log(`Room ID: ${roomID}`);
    return (
            <div className="container">
                <LobbyRoom roomID = {roomID} />
            </div>
    )
}

export default Lobby