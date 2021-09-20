'use strict';
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const SERVER_URL = require('./client/src/constants');
const app = express();
const {addUser, removeUser, getUser, getUsersInRoom, playersInRoom, getRandomInt} = require('./users');

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

console.log('Starting in ' + process.env.NODE_ENV + ' mode');

const io = require("socket.io")(server);

const cors = require('cors');
app.use(cors({credentials: true}));

//relative path to work on different OSes
const path = require('path');
const bodyParser = require('body-parser');
const first = getRandomInt(2);
console.log(`Player ${first} is starting first`);



io.on("connection", socket => {
  console.log("user connected socketid: " + socket.id);

  socket.on("set username", (username) => {
    socket.username = username;
  });

  socket.on("join room", (room, callback) => {
    const {error, user} = addUser( {id: socket.id, name: socket.username, room: room});
    if (error) {
      console.log(error);
      return callback(error);
    }
    socket.join(room);
    console.log(user.name + " joined room " + room);

    //io.to(room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
    
    callback();
    //First player enters
    if (playersInRoom(room) === first) {
      console.log(user.name + " is first to start in " + room);
      io.to(socket.id).emit('first');
      if (playersInRoom(room) === 2) {
      console.log("Game starting");
      io.to(room).emit('start game');
      }
    }
    else if (playersInRoom(room) === 2) {
      console.log("Game starting");
      io.to(room).emit('start game');
    }
  });
  //Passing turns
  socket.on("pass turn", (plyr2) => {
    const user = getUser(socket.id);
    // console.log(user.name + " passed turn(app)");
    socket.to(user.room).emit('pass turn', (plyr2));
  });

  socket.on("removeCard", (obj) => {
    const user = getUser(socket.id);
    socket.to(user.room).emit('removeCard', {index: obj.index, id:obj.id, plyr: obj.plyr});
  });

  socket.on('burnImage', (ind) => {
    const user = getUser(socket.id);
    socket.to(user.room).emit('burnImage', (ind));
  });

  socket.on('addAnimation', (str) => {
    const user = getUser(socket.id);
    socket.to(user.room).emit('addAnimation', (str));
  });
  socket.on('removeAnimation', (str) => {
    const user = getUser(socket.id);
    socket.to(user.room).emit('removeAnimation', (str));
  });

  socket.on('freeThrowButton', (str) => {
    const user = getUser(socket.id);
    socket.to(user.room).emit('freeThrowButton', (str));
  });

  socket.on('throwCardButton', (str) => {
    const user = getUser(socket.id);
    socket.to(user.room).emit('throwCardButton', (str));
  });

  socket.on('specialButton', (str) => {
    const user = getUser(socket.id);
    socket.to(user.room).emit('specialButton',(str));
  });

  socket.on("text", (msg) => {
    const user = getUser(socket.id);
    if (user)
    {
      io.to(user.room).emit('message', {user: user.name, text: msg});
      console.log("message: " + msg + " from user: " + user.name + " id: " + socket.id);
    }
  });

  socket.on('welcome', ()=>{
    console.log(socket.username + " connected to welcome socket with id: " + socket.id);
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) console.log(user.name + " left the chat with id: " + socket.id);
  });

  socket.on('deal', (dealObj) => {
    const user = getUser(socket.id);
    socket.to(user.room).emit('deal', {plyr: dealObj.plyr, deck: dealObj.deck});
  });

  socket.on('oppPlayer', (plyr2) => {
    const user = getUser(socket.id);
    socket.to(user.room).emit('oppPlayer', (plyr2));
  });

  socket.on('setDrawCard', (plyr2)=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('setDrawCard', (plyr2));
  });

  socket.on('removeDrawImage', (plyr2)=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('removeDrawImage', (plyr2));
  });

  socket.on('setGroundCard', (obj)=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('setGroundCard', {card: obj.card, plyr: obj.plyr});
  });

  socket.on('addPickCardClassOpponent', ()=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('addPickCardClassOpponent');
  });

  socket.on('flipCardBackOpponent', (obj)=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('flipCardBackOpponent', {el: obj.el, index: obj.index});
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