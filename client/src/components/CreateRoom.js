import React from 'react';
import { useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import SERVER_URL from "../constants";
import sok from "../services/socket";

export default function CreateRoom({checkIfUserLoggedIn}) {
    let data;
    const history = useHistory();
    const routerToRoom = () => {
      history.push(`/lobby/${data.roomID}`);
    }

    async function createRoom(){
        let loggedIn = await checkIfUserLoggedIn();
        if(!loggedIn){
            document.querySelector(".join-room-input").style.borderTopLeftRadius = "0";
            document.querySelector(".join-room-input").style.borderTopRightRadius = "0";
            let login_err_text = document.getElementById("loginrequire");
            login_err_text.classList.remove('d-none');
            let txt = document.createElement('p');
            txt.innerHTML = "Please Login or SignUp in order to continue.<br/> You can click on the MONKE icon above to play as a guest or SignUp and keep track of your winrate, rating, match history and more.";
            login_err_text.appendChild(txt);
            return;
        }
        try{
            console.log('Reacccccccccccccccched creating room');
              const res = await fetch(`${SERVER_URL}/createroom`, {
                  method: 'POST',
                  headers: { 'Content-Type' : 'application/json' },
                  credentials: 'include'
              });
              data = await res.json();
              console.log(`New room data is ${data.roomID}`);
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