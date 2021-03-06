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
        //Only save the latest 5 games
        await GameHistory.find({}, async(err, allgames) =>{
            if(err){
                console.log("Error getting all gamehistories");
            }
            if(allgames.length >= 5){
                await GameHistory.findOneAndDelete({},{"sort": { "_id": 1 }});
            }
        });
        await this.create({user1, user2, nbrounds, status1, status2});

        const player1 = await Players.findOne({username: user1});
        let gamesPlayed1 = player1.gamesPlayed + 1;
        let gamesWon1 = status1 == "Win" ? player1.gamesWon + 1 : player1.gamesWon;
        let winrate1 = (gamesWon1 / gamesPlayed1) * 100;

        const player2 = await Players.findOne({username: user2});
        let gamesPlayed2 = player2.gamesPlayed + 1;
        let gamesWon2 = status2 == "Win" ? player2.gamesWon + 1 : player2.gamesWon;
        let winrate2 = (gamesWon2 / gamesPlayed2) * 100;

        await Players.findOneAndUpdate({"username": user1}, {gamesPlayed: gamesPlayed1, gamesWon: gamesWon1, winrate: winrate1});
        await Players.findOneAndUpdate({"username": user2}, {gamesPlayed: gamesPlayed2, gamesWon: gamesWon2, winrate: winrate2});
        
    }catch(err){
        console.log(err);
    }
}
const GameHistory = mongoose.model('gameHistory', GameSchema);

module.exports = GameHistory;