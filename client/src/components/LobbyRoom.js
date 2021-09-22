import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import sok from "../services/socket";
import { useHistory } from "react-router-dom";

export default function LobbyRoom({roomID}) {
    var socket = sok.getSocket();

    const history = useHistory();
    const routerToRoom = () => {
        history.push('/room');
    }

    socket.on('goToRoom', () => {
        console.log("Going to join now");
        routerToRoom();
    });
    console.log(`Room ID at lobby room ${roomID}`);
    return(
        <div><h1>Waiting for Opponent...</h1><br/><p>Room ID: {roomID}</p></div>
    );
}
