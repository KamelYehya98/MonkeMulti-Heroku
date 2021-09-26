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
        type: Date,
        default: Date.now
    }
});

MatchHistorySchema.post('save', function(doc, next){
    console.log('match details saved succesfully');
    next();
});

function calcRate (rating1, rating2, games1, games2, winner) {
    let newScore1, newScore2, score1 = rating1, score2 = rating2;
    let s1, s2;
    if (winner === 1) {
        s1 = 1;
        s2 = 1;
    }
    else if (winner === 2) {
        s1 = -1;
        s2 = 0;
    }
    else if (winner === 0) {
        s1 = 0;
        s2 = 0.5;
    }
    //If A and B are both on Provisional Ranking:
    if (games1 < 20 && games2 < 20) {
        newScore1 = (score1 * games1 + (score1 + score2) / 2 + 100 * s1) / games1 + 1;
        newScore2 = (score2 * games2 + (score1 + score2) / 2 + 100 * s1) / games2 + 1;
    }
    //If A is on the Provisional Ranking, and B on the Established one:
    if (games1 < 20 && games2 >= 20) {
        newScore2 = (score2 * games2 + score1 + 200 * s1) / games2 + 1;
        newScore1 = (score1 * games1 + score2 + 200 * s1) / games1 + 1;
    }
    //If A is on the Established Ranking, and B on the Provisional one:
    if (games1 >= 20 && games2 < 20) {
        newScore1 = score1 + 32 * games2 / 20 * (s2 - (1 / 1 + Math.pow(10, (score2 - score1) / 400)));
        newScore2 = score2 + 32 * games1 / 20 * (s2 - (1 / 1 + Math.pow(10, (score1 - score2) / 400)));
    }
    //If A and B are both on the Established Ranking:
    if (games1 >= 20 && games2 >= 20) {
        newScore1 = score1 + 32 * (s2 - (1 / 1 + Math.pow(10, (score2 - score1) / 400)));
        newScore2 = score2 + 32 * (s2 - (1 / 1 + Math.pow(10, (score1 - score2) / 400)));
    }
    return {newScore1, newScore2};
}



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

        let winner = 0;
        if (score1 > score2) winner = 1;
        if (score1 < score2) winner = 2;
        if (score1 === score2) winner = 0;
        //Update Player 1 stats
        let player1 = await Players.findOne({username: user1});
        let roundsPlayed = player1.roundsPlayed + 1;
        let rating1 = player1.rating;
        let games1 = player1.gamesPlayed;
        await Players.findOneAndUpdate({"username": user1}, {roundsPlayed});

        //Update Player 2 stats
        let player2 = await Players.findOne({username: user2});
        roundsPlayed = player2.roundsPlayed + 1;
        let rating2 = player2.rating;
        let games2 = player2.gamesPlayed;
        await Players.findOneAndUpdate({"username": user2}, {roundsPlayed});

        //Check if there is a winner of the game
        let player1wins = 0, player2wins = 0;
        let matches = await this.find({
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
                else if(matches[i].status1 == "Lose")
                    player2wins++;
            }else{
                if(matches[i].status2 == "Win")
                    player1wins++;
                else if(matches[i].status2 == "Lose")
                    player2wins++;
            }
        }
        console.log(user1 + " wins: " + player1wins);
        console.log(user2 + " wins: " + player2wins);
        if(player1wins >= 3 || player2wins >=3 || matches.length == 5){
            await this.deleteMany({
                $or:[
                    {user1, user2},
                    {user1: user2, user2: user1}
                ]
            });
            if(player1wins > player2wins){
                status1 = "Win";
                status2 = "Lose";
            }else if(player2wins > player1wins){
                status1 = "Lose";
                status2 = "Win";
            }else{
                status1 = "Draw";
                status2 = "Draw";
            }
            Games.createGameHistory(user1, user2, status1, status2, matches.length);

            const{newScore1, newScore2} = calcRate(rating1, rating2, games1, games2, winner);
            console.log("New Score 1: ");
            console.log(newScore1);
            console.log(newScore2);
            //Updating Players' rating
            console.log("REEEEEEEEEEEEEEEEACHED THE UPDATE SCORES::::::::::::::::::::::");
            console.log("user1: " + user1);
            console.log("user2: " + user2);
            console.log("rating1: " + newScore1);
            console.log("rating2: " + newScore2);
            
        
            await Players.findOneAndUpdate({"username": user1}, {rating: newScore1});
            await Players.findOneAndUpdate({"username": user2}, {rating: newScore2});
        }
        console.log("Done with MatchHistory.js");
    }catch(err){
        console.log(err);
    }
};
const MatchHistory = mongoose.model('matchhistory', MatchHistorySchema);

module.exports = MatchHistory;