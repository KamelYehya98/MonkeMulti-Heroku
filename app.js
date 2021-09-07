'use strict';
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const SERVER_URL = require('./client/src/constants');
const app = express();

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

console.log('Starting in ' + process.env.NODE_ENV + ' mode');

const io = require("socket.io")(server);

const cors = require('cors');
app.use(cors({credentials: true}));

//relative path to work on different OSes
const path = require('path');
const bodyParser = require('body-parser');

const MAX_PLAYERS = 2;
let cur_room;

io.on("connection", socket => {
  console.log("user connected socketid: " + socket.id);

  socket.on("set username", (username) => {
    socket.username = username;
  });

  socket.on("join room", (room) => {
    cur_room = room;
    socket.join(room);
    console.log(socket.rooms);
    console.log("Socket " + socket.id + " joined room " + cur_room);
    // Add roomId to socket object
    // socket.roomId = roomId;
    // console.log('joined room!', socket.roomId, 'socket.id: ', socket.id);
    // // join the room
    // socket.join(roomId);
  });

  socket.on("text", (msg) => {
    io.to(cur_room).emit('text', msg);
    console.log("message: " + msg + " from user: " + socket.username + " in app");
  });

  socket.on('welcome', ()=>{
    console.log(socket.username + " connected to welcome socket");
  });
});

// database connection
const dbURI = "mongodb+srv://kamelyehya:kamelyehya@cluster0.rpil9.mongodb.net/monkedbn?retryWrites=true&w=majority"
mongoose.connect(dbURI,{
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex:true
})
.then(()=> console.log('Connected to the database.'))
.catch((err)=>console.log('Failed to connect to Database error:' + err));

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);

// routes
//checking if app is running on Heroku
if (process.env.NODE_ENV === 'production')
{
  //starts React from build folder
  app.use(express.static(path.resolve(__dirname, './client/build')));

  //for reconnecting purposes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });
}
else
{
  //app running locally
  app.use(express.static(path.resolve(__dirname, './client/build')));

  //for reconnecting purposes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });
}