import React from 'react';
import "../pages/css/Chat.css";

export default function ChatBox(){

    function sendMessage(){
        var list = document.getElementById("messageList");
        var entryText = document.createElement("p");
        entryText.textContent = document.getElementById("messageInput").value;
        var entry = document.createElement("li");
        entry.appendChild(entryText);
        list.appendChild(entry);
        document.getElementById("messageInput").value = '';
        entry.classList.add("me");
    }

    return (
        <div className="chat">
            <div className="messages-wrapper">
                <div className="messages">
                    <ul id="messageList">
                        <li className="me"><p>Hi</p></li>
                        <li className="you"><p>What's up?</p></li>
                    </ul>
                </div>
            </div>
            
            <div className="send-message">
                <input type="text" placeholder="Message" id="messageInput"/>
                <div>
                    <button onClick={sendMessage} onKeyPress="">Send</button>
                </div>
            </div>
        </div>
    )
}