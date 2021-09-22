import React from 'react';
import { useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import SERVER_URL from "../constants";
import sok from "../services/socket";

export default function CreateRoom() {
    let data;
    const history = useHistory();
    const routerToRoom = () => {
      history.push(`/lobby/${data.roomID}`);
    }

    async function createRoom(){
        try{
            console.log('Reacccccccccccccccched creating room');
              const res = await fetch(`${SERVER_URL}/createroom`, {
                  method: 'POST',
                  headers: { 'Content-Type' : 'application/json' },
                  credentials: 'include'
              });
              data = await res.json();
              console.log(`New room data is ${data.roomID}`);
              //window.location.assign('/createroom');
              var socket = sok.getSocket();
              socket.emit('join room', data.roomID, (err) => {
                routerToRoom();
              });
          }catch(err){
              console.log(err);
          }
    }
    return (
    <div>
        <button onClick={createRoom} className="create-room-button">Create A Room</button>
    </div>
    )
}