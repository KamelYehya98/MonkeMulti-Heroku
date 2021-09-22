import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import sok from "../services/socket";
import { useHistory } from "react-router-dom";
import "./dots.css";

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
        <div className="mt-5">
            <div className="d-flex align-items-baseline justify-content-center pt-5">
                <h1>Waiting for Opponent</h1>
                <div class="snippet" data-title=".dot-typing">
                    <div class="stage">
                    <div class="dot-typing"></div>
                    </div>
                </div>
            </div>
            <br/>
            <center><p>Room ID: {roomID}</p></center>
        </div>
    );
}
