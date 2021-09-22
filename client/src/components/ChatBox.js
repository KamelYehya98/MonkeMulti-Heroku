import React from 'react';
import sok from '../services/socket';
import "../pages/css/Chat.css";

export default function ChatBox(){
    const socket = sok.getSocket();

    socket.on('message', (mesObj) => {
        var list = document.getElementById("messageList");
        var entryText = document.createElement("p");
        //get user that sent it using mesObj.user
        entryText.textContent = mesObj.text;
        var entry = document.createElement("li");
        entry.appendChild(entryText);
        list.appendChild(entry);
        entry.classList.add("you");
        entry.scrollIntoView();
    });

    function sendMessage(){
        var list = document.getElementById("messageList");
        var entryText = document.createElement("p");
        var message = document.getElementById("messageInput").value;
        if (message)
        {
            entryText.textContent = message;
            var entry = document.createElement("li");
            entry.appendChild(entryText);
            list.appendChild(entry);
            document.getElementById("messageInput").value = '';
            entry.classList.add("me");
            entry.scrollIntoView();
            socket.emit('text', message);
        }
    }

    return (
        <div className="chat d-none" id = "chatBox">
            <div className="messages-wrapper">
                <div className="messages">
                    <ul id="messageList">
                    </ul>
                </div>
            </div>
            
            <div className="send-message d-flex align-items-end">
                <input type="text" placeholder="Message" id="messageInput"/>
                <div>
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    )
}