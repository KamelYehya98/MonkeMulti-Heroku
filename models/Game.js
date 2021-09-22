const mongoose = require('mongoose');

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
        type:Date,
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
        await this.create({user1, user2, status1, status2, nbrounds});
    }catch(err){
        console.log(err);
    }
};
const GameHistory = mongoose.model('gameHistory', GameSchema);

module.exports = GameHistory;