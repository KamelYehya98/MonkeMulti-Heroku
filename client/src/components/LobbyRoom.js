import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import {socket} from "../services/socket";
import {useState} from 'react';

export default function LobbyRoom() {
    console.log("Reached Lobby");

    let messages, input, username;
    const [turn, flipTurn] = useState(true);
    function pass()
    {
        console.log(`${username} pressed battoon`);
        socket.emit('pass turn');
        flipTurn(!turn);
    }

    useEffect(() => {
        socket.on('message', (msgObj) => {
            console.log(`${msgObj.user} says ${msgObj.text}`);

            var item = document.createElement('li');
            item.innerHTML = msgObj.text;
            messages = document.getElementById('messages');
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        });
    }, [messages]);

    socket.on('pass turn', (passedFrom) => {
        console.log(`Socket ${passedFrom} passed turn(${socket.id})`);
        flipTurn(!turn);
    });

    socket.on('first', () => {
        console.log("What it do, I'm first");
        flipTurn(false);
    })

    socket.on("connect_error", (err) => {
        console.log('connect_error due to ' + err.message);
    });
    console.log('check 1', socket.connected);
    socket.on('connect', function() {
        console.log('check 2', socket.connected);
    });

    async function SendMessage(e){ 
        e.preventDefault();
        messages = document.getElementById('messages');
        input = document.getElementById('input');

        if (input.value) {
            socket.emit('text', input.value);
            input.value = '';
        }
    }
    
    return(
        <div>
            <ul id="messages"></ul>
            <form id="form" onSubmit={SendMessage}>
                <input id="input" autoComplete="off" /><button>Send</button>
            </form>
            <h1 disabled = {turn}>Firsto</h1>
            <button id = "poopsy" onClick={pass} disabled = {turn}>Pass Turn</button>
        </div>
    );
}
