import React from 'react';
import { useHistory } from "react-router-dom";
import 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SERVER_URL from "../constants";
import sok from "../services/socket";
import '../pages/css/Welcome.css';

export default function JoinRoom({checkIfUserLoggedIn}) {
    const history = useHistory();
    const routerToRoom = () => {
      history.push('/room');
    }

    async function joinRoom(){
        let loggedIn = await checkIfUserLoggedIn();

        const room_id = document.getElementById('room_id').value;
        let error_div = document.getElementById('error_div');
        //creating the error text
        let err_text = document.createElement('div');
        err_text.classList.add('text-light', 'text-center');
        err_text.id = "errtxt";
        error_div.appendChild(err_text);

        setTimeout(() => {
            if(document.getElementById("errtxt") != null)
                document.getElementById("errtxt").remove();
            if(document.getElementById('errtxt') == null){
                document.querySelector(".join-room-input").style.borderTopLeftRadius = "8px";
                document.querySelector(".join-room-input").style.borderTopRightRadius = "8px";
            }
        }, 5000);

        if(room_id === ""){
            document.querySelector(".join-room-input").style.borderTopLeftRadius = "0";
            document.querySelector(".join-room-input").style.borderTopRightRadius = "0";
            err_text.innerHTML = "Please enter a room ID";
            return;
        }else if(!loggedIn){
            console.log("User is not logged in..........");
            document.querySelector(".join-room-input").style.borderTopLeftRadius = "0";
            document.querySelector(".join-room-input").style.borderTopRightRadius = "0";
            let login_err_text = document.getElementById("loginrequire");
            login_err_text.classList.remove('d-none');
            let txt = document.createElement('p');
            txt.innerHTML = "Please Login or SignUp in order to continue.<br/> You can click on the MONKE icon above to play as a guest or SignUp and keep track of your winrate, rating, match history and more.";
            login_err_text.appendChild(txt);
            return;
        }else {
            err_text.innerHTML = "";
        }
        //Join The Room
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
                document.querySelector(".join-room-input").style.borderTopLeftRadius = "0";
                document.querySelector(".join-room-input").style.borderTopRightRadius = "0";
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
                routerToRoom();
            });
          }catch(err){
              console.log(err);
          }
    }


    return (
        <div className="w-100">
            <div>
                <div id='error_div' className="bg-danger"></div>
                <input type="text" id="room_id" name="room_id" className="join-room-input" placeholder="Enter Room ID"/>
            </div>
            <button onClick={joinRoom} className="join-room-button">Join Room</button>
        </div>
    );
}