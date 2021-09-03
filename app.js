'use strict';
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {checkUser} = require('./middleware/authMiddleware');
const app = express();
const cors = require('cors');

app.use(cors({credentials: true}));
var http = require('http').createServer(app)
var io = require('scoket.io')(http);


//relative path to work on different OSes
const path = require('path');
const bodyParser = require('body-parser');

app.listen( process.env.PORT || 3001);
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
app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);

// routes
app.get('*', checkUser);

//checking if app is running on Heroku
if (process.env.NODE_ENV === 'production')
{
  //starts React from build folder
  app.use(express.static('client/build'));

  //for reconnecting purposes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });
}

const MAX_PLAYERS = 2;

io.on("connection", function (socket) {
  console.log("user connected socketid: " + socket.id);
  socket.on("join room", function ({msg}) {
    socket.emit('join room', msg);
    // Add roomId to socket object
    // socket.roomId = roomId;
    // console.log('joined room!', socket.roomId, 'socket.id: ', socket.id);
    // // join the room
    // socket.join(roomId);
  })
});
