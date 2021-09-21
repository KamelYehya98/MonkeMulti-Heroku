import React from 'react';
import { useHistory } from "react-router-dom";
import 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SERVER_URL from "../constants";
import sok from "../services/socket";
import Monke from "../game_classes/Monke";
import '../pages/css/Welcome.css';

export default function JoinRoom() {
    const history = useHistory();
    const routerToRoom = () => {
      //history.push('/joinRoom');
      history.push('/room');
    }

    async function joinRoom(){
        const room_id = document.getElementById('room_id').value;
        let error_div = document.getElementById('error_div');
        //creating the error text
        let err_text = document.createElement('div');
        err_text.classList.add('text-danger', 'text-center');
        error_div.appendChild(err_text);

        if(room_id == null){
            err_text.innerHTML = "Please enter a room ID";
            return;
        }else {
            err_text.innerHTML = "";
        }
        try{
            console.log('Reacccccccccccccccched joining room');
              const res = await fetch(`${SERVER_URL}/joinroom`, {
                  method: 'POST',
                  body: JSON.stringify({ room_id }),
                  headers: { 'Content-Type' : 'application/json' },
                  credentials: 'include'
              });
              const data = await res.json();
              if(data.error)
              {
                err_text.innerHTML = "Room doesn't exist";
                  return;
              }
              var socket = sok.getSocket();
              socket.emit('join room', room_id, (err) => {
                if (err) {
                    console.log("What it do error man");
                    err_text.innerHTML = err;
                    return;
                }
                console.log(data);
                //window.location.assign('/joinRoom');
                routerToRoom();
                Monke.remPlayer2Comp();
            });
          }catch(err){
              console.log(err);
          }
    }
    return (
        <div className="w-100">
            <div>
                <div id='error_div' className="bg-light"></div>
                <input type="text" id="room_id" name="room_id" className="join-room-input" placeholder="Enter Room ID"/>
            </div>
            <button onClick={joinRoom} className="join-room-button">Join Room</button>
        </div>
    );
}