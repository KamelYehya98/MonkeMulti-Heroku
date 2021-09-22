const mongoose = require('mongoose');
const Players = require('./Players');
const Games = require('./Game');

const MatchHistorySchema = new mongoose.Schema({
    user1:{
        type: String,
        required: true
    },
    user2:{
        type: String,
        required: true
    },
    score1:{
        type: Number,
        required: true
    },
    score2:{
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
    matchdate: {
        type:Date,
        default: Date.now
    }
});

MatchHistorySchema.post('save', function(doc, next){
    console.log('match details saved succesfully');
    next();
});

//Static method to log in the user
MatchHistorySchema.statics.createMatchHistory = async function(user1, user2, score1, score2){
    let status1 = "", status2 = "";
    if(score1 > score2){
        status1 = "Lose"; status2 = "Win";
    }else if(score1 < score2){
        status1 = "Win"; status2 = "Lose";
    }else{
        status1 = status2 = "Draw";
    }
    try{
        await this.create({user1, user2, score1, score2, status1, status2});

        //Update Player 1 stats
        let player1 = await Players.findOne({username: user1});
        let roundsPlayed = player1.roundsPlayed + 1;
        await Players.findOneAndUpdate({"username": user1}, {roundsPlayed});

        //Update Player 1 stats
        let player2 = await Players.findOne({username: user2});
        roundsPlayed = player2.roundsPlayed + 1;
        await Players.findOneAndUpdate({"username": user2}, {roundsPlayed});

        //Check if there is a winner of the game
        let player1wins = 0, player2wins = 0;
        let matches = await MatchHistory.find({
            $or:[
                {user1, user2},
                {user1: user2, user2: user1}
            ]
        });
        console.log("THE MAT IS: " + matches.length);
        //console.log({matches});
        for(var i=0; i<matches.length; i++){
            if(matches[i].user1 == user1){
                if(matches[i].status1 == "Win")
                    player1wins++;
                else
                    player2wins++;
            }else{
                if(matches[i].status2 == "Win")
                    player1wins++;
                else
                    player2wins++;
            }
        }
        console.log(user1 + " wins: " + player1wins);
        console.log(user2 + " wins: " + player2wins);
        if(player1wins >= 3 || player2wins >=3){
            await MatchHistory.deleteMany({
                $or:[
                    {user1, user2},
                    {user1: user2, user2: user1}
                ]
            });
            if(player1wins > player2wins){
                status1 = "Win";
                status2 = "Lose";
            }else{
                status1 = "Lose";
                status2 = "Win";
            }
            await Games.createGameHistory(user1, user2, status1, status2, matches.length);
        }
    }catch(err){
        console.log(err);
    }
};
const MatchHistory = mongoose.model('matchhistory', MatchHistorySchema);

module.exports = MatchHistory;