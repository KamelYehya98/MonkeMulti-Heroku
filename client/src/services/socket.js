import io from "socket.io-client";
export var socket = io();
socket.on('connect', function() {
    console.log('connected socket in socket.js ', socket.connected);
});