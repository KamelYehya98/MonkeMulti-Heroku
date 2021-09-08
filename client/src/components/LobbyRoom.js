import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import {socket} from "../services/socket";
import {useState} from 'react';

export default function LobbyRoom() {
    console.log("Reached Lobby");

    let messages, input, user;
    const [but, flipBut] = useState(true);
    function pass()
    {
        console.log(`${user} pressed battoon`);
        socket.emit('pass turn');
        flipBut(!but);
    }
    
    socket.on("set username", (username) => {
        socket.username = username;
        user = username;
    });

    useEffect(() => {
        socket.on('message', (msg) => {
            console.log(`${socket.username} or ${user} says ${msg}`);   
            var item = document.createElement('li');
            item.innerHTML = msg;
            messages = document.getElementById('messages');
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        });
    }, [messages]);

    socket.on('pass turn', () => {
        console.log(`Socket ${socket.username} passed turn(Lobby)`);
        flipBut(!but);
    });

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
            <button id = "poopsy" onClick={pass} disabled = {but}>Batanzo</button>
        </div>
    );
}
