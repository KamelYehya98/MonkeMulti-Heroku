const mongoose = require('mongoose');

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
    let status1 = undefined, status2 = undefined;
    if(score1 > score2){
        status1 = "Lose"; status2 = "Win";
    }else if(score1 < score2){
        status1 = "Win"; status2 = "Lose";
    }else{
        status1 = status2 = "Draw";
    }
    try{
        await this.create({user1, user2, score1, score2, status1, status2});
    }catch(err){
        console.log(err);
    }
};
const MatchHistory = mongoose.model('matchhistory', MatchHistorySchema);

module.exports = MatchHistory;