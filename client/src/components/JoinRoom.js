import React from 'react';
import { useHistory } from "react-router-dom";
import 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function JoinRoom() {
    const history = useHistory();
    const routerToRoom = () => {
      history.push('/joinRoom');
    }

    async function joinRoom(){
        const room_id = document.getElementById('room_id').value;
        let error_div = document.getElementById('error_div');
        //creating the error text
        let err_text = document.createElement('div');
        err_text.classList.add('text-danger text-center');
        error_div.appendChild(err_text);

        if(room_id == null){
            err_text.innerHTML = "Please enter a room ID";
            return;
        }else {
            err_text.innerHTML = "";
        }
        try{
            console.log('Reacccccccccccccccched joining room');
              const res = await fetch('/joinroom', {
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
              console.log(data);
              //window.location.assign('/joinRoom');
              routerToRoom();
          }catch(err){
              console.log(err);
          }
    }
    return (
        <div className="d-flex flex-col align-items-center">
            <div>
                <div id='error_div' className="bg-light"></div>
                <span htmlFor="room_id" className="text-light">Enter Room ID: </span>
                <input type="text" id="room_id" name="room_id" />
            </div>
            <button onClick={joinRoom} className="btn btn-success" >JOIN ROOM</button>
        </div>
    );
}