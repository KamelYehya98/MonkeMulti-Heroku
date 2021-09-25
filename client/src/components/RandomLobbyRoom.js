import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import sok from "../services/socket";
import { useHistory } from "react-router-dom";
import "./dots.css";
import audio from '../audio/Waiting_Music.mp3';
import SERVER_URL from "../constants";

export default function RandomLobbyRoom() {
    const music = new Audio(audio);
    let data;
    music.play();
    var socket = sok.getSocket();
    //Creates temp room
    entered();

    const history = useHistory();
    const routerToRoom = () => {
        history.push('/room');
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
              return data.roomID;
          }catch(err){
              console.log(err);
          }
    }

    async function delRoom (roomID) {
        try{
            console.log('Reacccccccccccccccched deleting room');
              const res = await fetch(`${SERVER_URL}/deleteroom`, {
                  method: 'POST',
                  body: JSON.stringify({ roomID }),
                  headers: { 'Content-Type' : 'application/json' },
                  credentials: 'include'
              });
              const data = await res.json();
              if (data.error) {
                  console.log('Room does not exist (deleting)');
              }
          }catch(err){
              console.log(err);
          }
    }

    const unlisten = history.listen (location => {
        music.pause();
        if (!location.pathname.includes('room')) {
            console.log("Exited lobby");
            socket.emit('exit queue');
            unlisten();
        }
    });

    async function entered () {
        let roomID = await createRoom();
        console.log(`Random temp room ${roomID}`);
        socket.emit('join queue', roomID, (found) => {
            if (!found) {
                //delete temp room
                delRoom(roomID);
            }
        });
    }

    socket.on('join from queue', (roomID) => {
        socket.emit('join room', roomID, (err) => {
            routerToRoom();
        });
    });
    return(
        <div className="mt-5">
            <div className="d-flex align-items-baseline justify-content-center pt-5">
                <h1>Waiting for Opponent</h1>
                <div class="snippet" data-title=".dot-typing">
                    <div class="stage">
                    <div class="dot-typing"></div>
                    </div>
                </div>
            </div>
            <br/>
            <center><p><i>This may take a while</i></p></center>
        </div>
    );
}
