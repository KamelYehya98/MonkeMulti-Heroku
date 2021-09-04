import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CreateRoom() {

    async function createRoom(){
        try{
            console.log('Reacccccccccccccccched creating room');
              const res = await fetch('/createroom', {
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