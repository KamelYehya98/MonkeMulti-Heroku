const MatchHistory = require('../models/MatchHistory');
const Player = require('../models/Players')

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
            gamesPlayed: '-',
            winrate: '-',
            roundsPlayed: '-',
            rating: '-'
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
        });
    }catch(error){
        console.log(error);
        res.json({error: "database connection error / user not found"});
    }
}

module.exports.createMatchHistory = async (req, res) => {
    const { user1, user2, score1, score2 } = req.body;
    try{
        MatchHistory.createMatchHistory(user1, user2, score1, score2);
    }catch(error){
        console.log(error);
        res.json({error: "database connection error / user not found"});
    }
}