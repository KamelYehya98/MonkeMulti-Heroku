const MatchHistory = require('../models/MatchHistory');
const Player = require('../models/Players');
const Game = require('../models/Game');
const { getUser } = require('../users');

module.exports.getStats = async (req, res) => {
    const { username } = req.body;
    try{
        const player = await Player.findOne({ username });
        if(player){
            res.json({
                gamesPlayed: player.gamesPlayed,
                winrate: player.winrate,
                roundsPlayed: player.roundsPlayed,
                rating: player.rating
            });
            return;
        }
        res.json({
            gamesPlayed: 0,
            winrate: 0,
            roundsPlayed: 0,
            rating: 0
        });
    }catch(error){
        console.log(error);
        res.json({error: "database connection error / user not found"});
    }
}

module.exports.getMatchHistory = async (req, res) => {
    const { username } = req.body;
    try{
        await MatchHistory.find({$or:[{ user1:username }, {user2: username}]}, (err, matches) =>{
            if(err){
                console.log(err);
                res.json({err});
                return;
            }
            else{
                res.json({matches});
            }
        }).sort({matchdate:-1});
    }catch(error){
        console.log(error);
        res.json({error: "database connection error / user not found"});
    }
}

module.exports.getGameHistory = async (req, res) => {
    const { username } = req.body;
    try{
        await Game.find({$or:[{ user1:username }, {user2: username}]}, (err, games) =>{
            if(err){
                console.log(err);
                res.json({err});
                return;
            }
            else{
                res.json({games});
            }
        }).sort({gamedate:-1});
    }catch(error){
        console.log(error);
        res.json({error: "database connection error / user not found"});
    }
}

module.exports.createMatchHistory = async (req, res) => {
    const { user1, user2, score1, score2 } = req.body;
    try{
        await MatchHistory.createMatchHistory(user1, user2, score1, score2);
        console.log("Wsolet?");
        return;
    }catch(error){
        console.log(error);
        res.json({error: "database connection error / user not found"});
    }
}

module.exports.getLatestRoundResult = async (req, res) => {
    const { user1, user2 } = req.body;
    try{
        await MatchHistory.find({            
            $or:[
                {user1, user2},
                {user1: user2, user2: user1}
            ]}, (err, matches) =>{
        
            console.log("MAAAAAAAAAAAAAAAAAAAAAAAATCHES AREEEEEEEEEE: " + matches);
            if(matches.length == 0){
                res.json({res: "Empty"});
            }else{
                if(matches[0].status1 == "Win")
                    res.json({res: matches[0].user1});
                else if(matches[0].status1 == "Lose")
                    res.json({res: matches[0].user2});
                else 
                    res.json({res: "Draw"});
            }

        }).sort({matchdate:-1});
    }
    catch(error){
        console.log(error);
        res.json({error: "database connection error / user not found"});
    }
}


module.exports.getUsername = (req, res) => {
    const { id } = req.body;
    try{
      const result = getUser(id);
      res.json({id: result});
    }
    catch(error){
        console.log(error);
        res.json({error: "database connection error / user not found"});
    }
}

module.exports.getNbRoundsWon = async (req, res) => {
    const { user1 , user2 } = req.body;
    console.log(`User 1: ${user1} User 2: ${user2}`);
    let player1wins = 0, player2wins = 0;
    let matches = await MatchHistory.find({
        $or:[
            {user1, user2},
            {user1: user2, user2: user1}
        ]
    });
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
    let matchCount = matches.length;
    console.log(`Player 1 wins: ${player1wins} Player 2 wins: ${player2wins}, Match Count: ${matchCount}`);
    res.json({player1wins, player2wins, matchCount});
}