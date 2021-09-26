const mongoose = require('mongoose');
const Players = require('./Players');

const GameSchema = new mongoose.Schema({
    user1:{
        type: String,
        required: true
    },
    user2:{
        type: String,
        required: true
    },
    nbrounds:{
        type: Number,
        required: true
    },
    status1:{
        type: String,
        required: true
    }, 
    status2:{
        type:String,
        required: true
    },
    gamedate: {
        type: Date,
        default: Date.now
    }
});

GameSchema.post('save', function(doc, next){
    console.log('game details saved succesfully');
    next();
});

//Static method to log in the user
GameSchema.statics.createGameHistory = async function(user1, user2, status1, status2, nbrounds){
    try{
        const player1 = await Players.findOne({username: user1});
        let nbOfWins1 = Math.ceil((player1.winrate * player1.gamesPlayed)/100);
        player1.gamesPlayed = player1.gamesPlayed + 1;
        if(status1 == "Won")
            nbOfWins1 += 1;
        player1.winrate = (nbOfWins1 / player1.gamesPlayed) * 100;

        const player2 = await Players.findOne({username: user2});
        let nbOfWins2 = Math.ceil((player2.winrate * player2.gamesPlayed)/100);
        player2.gamesPlayerd = player2.gamesPlayed + 1;
        if(status2 == "Won")
            nbOfWins2 += 1;
        player2.winrate = (nbOfWins2 / player2.gamesPlayed) * 100;


        player1.save().then((savedplayer1)=>{
            console.log(`${user1} winrate updated successfully`);
            console.log(savedplayer1);
        });
        player2.save().then((savedplayer2)=>{
            console.log(`${user2} winrate updated successfully`);
            console.log(savedplayer2);
        });
        
    }catch(err){
        console.log(err);
    }
}
const GameHistory = mongoose.model('gameHistory', GameSchema);

module.exports = GameHistory;