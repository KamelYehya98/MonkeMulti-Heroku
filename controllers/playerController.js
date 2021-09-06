const User = require('../models/User');
const Player = require('../models/Players')
const Room = require('../models/Room');

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