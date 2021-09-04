import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SERVER_URL } from '../constants';

export default function CreateRoom() {

    async function createRoom(){
        try{
            console.log('Reacccccccccccccccched creating room');
              const res = await fetch(`${SERVER_URL}/createroom`, {
                  method: 'POST',
                  headers: { 'Content-Type' : 'application/json' },
                  credentials: 'include'
              });
              const data = await res.json();
              console.log(data);
              window.location.assign('/createroom');
          }catch(err){
              console.log(err);
          }
    }
    return (
    <div>
        <button onClick={createRoom} className="btn btn-primary w-100">CREATE ROOM</button>
    </div>
    )
}