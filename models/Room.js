const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const roomSchema = new mongoose.Schema({
    code:{
        type: String,
        unique: true,
        required: true
    },
    users:[{
        type: Number,
    }],
});

roomSchema.post('save', function(doc, next){
    console.log('room has been created successfully');
    next();
});

//Static method to log in the user
roomSchema.statics.createRoom = async function(){
    try{
        let code = '', roomId = '';

        do{
            code = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < 5; i++ ) {
                code += characters.charAt(Math.floor(Math.random() * 
                charactersLength));
            }
            roomId = await this.findOne( {code} );
            console.log("Room duplicate found was: " + roomId);
        }while(roomId != null);        
        let users = [];
        await this.create({ code , users });
        return code;
    }catch(err){
        console.log(err);
    }
};

roomSchema.statics.joinRoom = async function(id){
    try{
        let code = id;
        let result = await this.findOne({ code });
        return result;
    }catch(err){
        console.log(err);
    }
};

const Room = mongoose.model('room', roomSchema);

module.exports = Room;