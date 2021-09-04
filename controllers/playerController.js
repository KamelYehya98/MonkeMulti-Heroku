const User = require('../models/User');
const Player = require('../models/Players')
const Room = require('../models/Room');

module.exports.getStats = async (req, res) => {
    try{
        const { user } = req.body;
        const player = await Player.findOne({ user });
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
    }catch(err){
        res.json({err});
    }
}