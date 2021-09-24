import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RandomMatch () {
    const history = useHistory();
    const routerToRoom = () => {
      history.push(`/randomlobby`);
    }
    
    return (
        <div>
            <button onClick={routerToRoom} className="create-room-button">Random Match</button>
        </div>
    )
}