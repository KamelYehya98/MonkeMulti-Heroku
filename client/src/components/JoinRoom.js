import React from 'react';
import { useHistory } from "react-router-dom";
import 'react-dom';
import { SERVER_URL } from '../constants';

export default function JoinRoom() {
    const history = useHistory();
    const routerToRoom = () => {
      history.push('/joinRoom');
    }

    async function joinRoom(){
        const room_id = document.getElementById('room_id').value;
        let error_div = document.getElementById('error_div');
        if(room_id == null){
            error_div.innerHTML = "Please enter a room ID";
            return;
        }else {
            error_div.innerHTML = "";
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
                  error_div.innerHTML = "Room doesn't exist";
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
        <div>
            <div>
                <div id='error_div'></div>
                <spam for="room_id">Enter Room ID: </spam>
                <input type="text" id="room_id" name="room_id" />
            </div>
            <button onClick={joinRoom} >JOIN ROOM</button>
        </div>
    );
}