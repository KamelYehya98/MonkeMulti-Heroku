'use strict';
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const SERVER_URL = require('./client/src/constants');
const app = express();
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users');

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
var cur_players = 0;
let cur_room;

io.on("connection", socket => {
  console.log("user connected socketid: " + socket.id);

  socket.on("set username", (username) => {
    socket.username = username;
  });

  socket.on("join room", (room) => {
    cur_players++;
    socket.players++;
    console.log(`Player count: ${cur_players}`);
    if (cur_players <= MAX_PLAYERS)
    {
      io.to(socket.id).emit("set username", socket.username);
      cur_room = room;
      socket.join(room);
      console.log(socket.username + " joined room " + cur_room);

      addUser( {id: socket.id, name: socket.username, room: cur_room});
      if (cur_players === 1)
      {
        console.log(socket.username + " is first to enter");
        io.to(cur_room).emit('pass turn');
      }
    }
    else
    {
      console.log("MAX PLAYERS REACHED");
    }
  });

  socket.on("pass turn", () => {
    console.log(socket.username + " passed turn(app)");
    socket.to(cur_room).emit('pass turn');
  });

  socket.on("text", (msg) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', {user: user.name, text: msg});
    console.log("message: " + msg + " from user: " + socket.username + " id: " + socket.id);
  });

  socket.on('welcome', ()=>{
    console.log(socket.username + " connected to welcome socket with id: " + socket.id);
  });

  socket.on('disconnect', () => {
    if (cur_players > 0)
    {
      cur_players--;
      console.log(socket.username + " left the chat with id: " + socket.id);
    }
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