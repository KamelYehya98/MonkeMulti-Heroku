const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');
const Player = require('./Players');
const MatchHistory = require('./MatchHistory');
const GameHistory = require('./Game');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: [true, 'Please enter a username'],
    },
    email:{
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password:{
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 character']
    },
    resetToken:{
        type: String,
    },
    expireToken:{
        type: Date,
    }, 
    isGuest:{
        type: Boolean, 
        default: false
    }
});

userSchema.post('save', function(doc, next){
    console.log('user has been saved and added successfully');
    Player.createPlayer(this.username);
    next();
});

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.pre('findOneAndRemove', async function(next){
    console.log("REAACHED REMOVING USER GUEST ON DISCONNECT");
    await Player.findOneAndRemove({username: this.username});
    await MatchHistory.deleteMany({
        $or:[
            {user1: this.username},
            {user2: this.username}
        ]
    });
    next();
});

userSchema.statics.connectPlayer = async function(username){
    console.log(username);
    const player = await Player.findOne({ username });
    if(player){
        player.isConnected = true;
        player.save();
    }else{
        console.log("Player not found");
    }
}

//Static method to log in the user
userSchema.statics.login = async function(username, password){
    const user = await this.findOne({ username });
    if(user){
       const auth = await bcrypt.compare(password, user.password);
       if(auth){
           User.connectPlayer(username);
           return user;
       }
       throw Error('incorrect password');
    }else{
        const usere = await this.findOne({email:username});
        if(usere){
            const auth = await bcrypt.compare(password, usere.password);
            if(auth){
                User.connectPlayer(username);
                return usere;
            }
            throw Error('incorrect password');
        }
    }
    throw Error('incorrect username');
};


const User = mongoose.model('user', userSchema);

module.exports = User;