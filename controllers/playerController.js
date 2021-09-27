const User = require('../models/User');
const Player = require('../models/Players')
const Room = require('../models/Room');

module.exports.getStats = async (req, res) => {
    try{
        const { user } = req.body;
        const player = await Player.findOne({ user });
        console.log("player found was: " + player);
        if(player){
            res.json({
                gamesPlayed: player.gamesPlayed,
                winrate: player.winrate,
                roundsPlayed: player.roundsPlayed,
                rating: player.rating
            });
        }else{
            res.json({error: "user not found"});
        }
<<<<<<< Updated upstream
    }catch(err){
        res.json({err});
=======
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
    console.log("user1 is: " + user1);
    console.log("user2 is: " + user2);
    console.log("score1 is: " + score1);
    console.log("score2 is: " + score2);
    try{
        MatchHistory.createMatchHistory(user1, user2, score1, score2);
        console.log("Wsolet?");
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
>>>>>>> Stashed changes
    }
}