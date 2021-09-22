import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SERVER_URL from "../constants";

export default function RandomMatch () {

    async function randomMatch() {

    }
    
    return (
        <div>
            <button onClick={randomMatch} className="create-room-button">Random Match</button>
        </div>
    )
}