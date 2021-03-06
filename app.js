'use strict';
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const SERVER_URL = require('./client/src/constants');
const app = express();
const {addUser, removeUser, getUser, getUsersInRoom, playersInRoom, getRandomInt, addToQ, delFromQ} = require('./users');
const Players = require('./models/Players');
const Room = require ('./models/Room');
const User = require('./models/User');
let usr = undefined;

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>{
   console.log(`Listening on ${PORT}`)
});

console.log('Starting in ' + process.env.NODE_ENV + ' mode');

const io = require("socket.io")(server);

const cors = require('cors');
app.use(cors({credentials: true}));

//relative path to work on different OSes
const path = require('path');
const bodyParser = require('body-parser');
const first = getRandomInt(2);
let firstID;
console.log(`Player ${first} is starting first`);

function isGuest(username){
  console.log(username);
  if(username != null && username.length > 6 && username.slice(0, 6) === "Guest_")
      return true;
  return false;
}

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
    if (playersInRoom(room) === 1) {
      firstID = socket.id;
    }
    if (playersInRoom(room) === first) {
      console.log(user.name + " is first to start in " + room);
      io.to(socket.id).emit('first');
    }
    if (playersInRoom(room) === 2) {
      console.log("Game starting");
      io.to(firstID).emit('goToRoom');
      const users = getUsersInRoom(room);
      io.to(users[0].id).emit('start game', (users[0].name));
      io.to(users[1].id).emit('start game', (users[1].name));
    }
  });

  socket.on("sendUsername", (username)=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('sendUsername', (username));
  });

  socket.on("setNbCardsView", (nb)=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('setNbCardsView', (nb));
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
      socket.to(user.room).emit('message', {user: user.name, text: msg});
      console.log("message: " + msg + " from user: " + user.name + " id: " + socket.id);
    }
  });

  socket.on('welcome', ()=>{
    console.log(socket.username + " connected to welcome socket with id: " + socket.id);
    usr = socket.username;
  });

  socket.on('disconnect', (reason) => {
    console.log(socket.id);
    console.log(usr);
    if(isGuest(usr)){
      console.log("ACKNOWLEDGED USER IS GUEST.........");
      User.findOneAndRemove({username: usr}, error=>{
        if(error)
          console.log(error);
      });
    }
    const user = removeUser(socket.id);
    console.log("DISCONNECTING.........");
    if (user) {
      console.log(user.name + " left the room with id: " + socket.id + "because of " + reason);
      if (playersInRoom(user.room) === 0 && user.room !== '5d6ru') {
        Room.deleteRoom (user.room);
      }
    }
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

  socket.on('exitRoom', () => {
    const user = removeUser(socket.id);

    if (user) {
      console.log(user.name + " left the room with id: " + socket.id);
      socket.leave(user.room);
      socket.to(user.room).emit('userDisconnected', (user.name));
      if (playersInRoom(user.room) === 0 && user.room !== '5d6ru') {
        Room.deleteRoom (user.room);
      }
    }
  });
  
  socket.on('join queue', (roomID, callback) => {
    let rating;
    Players.getRating(socket.username).then(function (r) {
      rating = r;
    });
    setTimeout(() => {
      console.log(`${socket.username} entered the queue`);
      console.log(rating);
      console.log(`${socket.username}'s rating is ${rating}`);
      const {id1, id2, res} = addToQ({id: socket.id, name: socket.username, rating: rating});
      if (!res) {
        delFromQ(id1);
        delFromQ(id2);
        callback(true);
        io.to(id1).to(id2).emit('join from queue', roomID);
        return;
      }
      callback(false);
      }, 500);
  });

  socket.on('exit queue', () => {
    const user = delFromQ(socket.id);
    if (user) {
      console.log(`${user.name} left the queue`);
    }
  });

  socket.on('removeClassFromAllElements', (str)=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('removeClassFromAllElements', (str));
  });
  socket.on('addClassSeven', (obj)=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('addClassSeven', {el: obj.el, plyr: obj.plyr});
  });

  socket.on('removeAnimationSeven', (str)=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('removeAnimationSeven', (str));
  });

  socket.on('setPlayerOpp', (plyr)=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('setPlayerOpp', (plyr));
  });

  socket.on('setDeck', (deck)=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('setDeck', (deck));
  });


  socket.on('setOppImage', ()=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('setOppImage');
  });

  socket.on('setOppDeck', ()=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('setOppDeck');
  });

  socket.on('swapCards', (obj)=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('swapCards', {ind1: obj.ind1, ind2: obj.ind2});
  });

  socket.on('monke', ()=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('monke');
  });

  socket.on('oppSelectCard', (index) => {
    const user = getUser(socket.id);
    socket.to(user.room).emit('oppSelectCard', (index));
  });

  socket.on('drawsFirst', ()=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('drawsFirst');
  });

  socket.on('unBlockAction', ()=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('unBlockAction');
  });

  socket.on('oppViewedCards', ()=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('oppViewedCards');
  });

  socket.on('calculateResults', ()=>{
    const user = getUser(socket.id);
    socket.to(user.room).emit('calculateResults');
  });

  socket.on('showRoundPrompt', (obj) => {
    const user = getUser(socket.id);
    socket.to(user.room).emit('showRoundPrompt', {user1: obj.user1, user2: obj.user2, score1: obj.score1, score2: obj.score2, rounds1: obj.rounds1, rounds2: obj.rounds2, stateOfMatch2: obj.stateOfMatch2});
  });

  socket.on('hideRoundButton', () => {
    const user = getUser(socket.id);
    socket.to(user.room).emit('hideRoundButton');
  });

  socket.on('nextPressed', () => {
    const user = getUser(socket.id);
    socket.to(user.room).emit('nextPressed');
  });

  socket.on('nextRound', (room) => {
    const user = getUser(socket.id);
    socket.to(user.room).emit('nextRound', (room));
  });
  
});

// database connection
const dbURI = "mongodb+srv://kamelyehya:kamelyehya@cluster0.rpil9.mongodb.net/monkedbn?retryWrites=true&w=majority"
mongoose.connect(dbURI,{
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex:true
})
.then(()=> {console.log('Connected to the database.')
})
.catch((err)=>{console.log('Failed to connect to Database error:' + err)
});

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