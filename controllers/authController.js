const User = require('../models/User');
const Player = require('../models/Players')
const Room = require('../models/Room');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const session = require('express-session');
const SERVER_URL = require('../client/src/constants');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.monke@gmail.com',
        pass: 'monke47monke'
    }
});

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {username: '', email: '', password: ''};

    //Incorrect email
    if(err.message ==='incorrect username'){
        errors.username = 'Username/Email not registered';
    }
    //Incorrect pass
    if(err.message ==='incorrect password'){
        errors.password = 'Incorrect Password';
    }
    //Duplicate email or username
    if(err.code === 11000){
        if(err.keyPattern.email){
            errors.email = "Email taken";
        }
        if(err.keyPattern.username){
            errors.username = "Username taken";
        }
    }
    //validation errors
    if(err.message.includes('user validation fail')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) =>{
    return jwt.sign({ id }, 'yumeoakirameteshindekure', {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) => {
}

module.exports.login_get = (req, res) => {
}

module.exports.login_post = async (req, res) => {
    const { username, password } = req.body;
    try{
        const user = await User.login(username, password);
        const token = createToken(user._id);
        console.log("token: " + token);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user});
        console.log("logged in");
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.signup_post = async (req, res) => {
    const{username, email, password} = req.body;
    try{
        const user = await User.create({username, email, password, resetToken:"0", expireToken:Date.now()});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        User.connectPlayer(user.username);
        res.status(201).json({user});
    }catch(err){
        const errors = handleErrors(err, req);
        res.status(400).json({ errors });
    }
}

module.exports.logout_post = (req, res) => {
    console.log("loggin out..........................");
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}

module.exports.forgot_post = (req, res)=> {
    crypto.randomBytes(32, async (err, buffer)=>{
        if(err){ 
            console.log(err);
        }
        const token = buffer.toString('hex');
        console.log("written email: " + req.body.email);
        const user = await User.findOne({email:req.body.email});
        
        if(!user){
            res.status(422).json({message: "Email not registered"});
            return;
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        console.log("server url is: " + SERVER_URL);
        user.save().then((result)=>{
            transporter.sendMail({
                to: user.email,
                from:"noreply.monke@gmail.com",
                subject:"Password Reset",
                // html:`<p>click <a href="http://localhost:${FrontEndPORT}/reset/${token}">here</a> to reset your password</p>`
                html:`<p>click <a href='${SERVER_URL}/reset/${token}'>here</a> to reset your password</p>`

            })
            res.json({message:"A link has been sent to your email"})
        });
    })
};

module.exports.reset_post = async(req, res) => {
    const password = req.body.password1;
    const sentToken = req.body.token;
    console.log("pass: " + password);
    console.log("resetToken: " + sentToken);
    try{
        if(user){
            user.password = password;
            user.resetToken = undefined;
            user.expireToken = undefined;
            user.save().then((saveduser)=>{
                console.log(saveduser);
                res.json({ message: "Password updated successfully" });
                res.redirect('/')
            });
        }
    }catch(error){
        res.json({ error });
    }
    
}

module.exports.createroom_post = async (req, res) => {
    try{
        const roomID = await Room.createRoom();
        console.log(`Created room id is ${roomID}`);
        res.status(200).json({roomID});
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.joinroom_post = async (req, res) => {
    try{
        let id = req.body.room_id;
        console.log("room id entered is: " + id);
        const result = await Room.joinRoom(id);
        let error = "";
        if(result == null){
            error = "Room doesn't exist";
            res.json({ error })
        }else{
            res.status(200).json({});
        }
    }catch(err){
        console.log(err);
        res.status(400).json({ err });
    }
}

module.exports.deleteroom_post = async (req, res) => {
    try{
        let id = req.body.roomID;
        console.log("room id entered is: " + id + " (delete room)");
        const result = await Room.deleteRoom(id);
        let error = "";
        if(result == null){
            error = "Room doesn't exist";
            res.json({ error })
        }else{
            res.status(200).json({});
        }
    }catch(err){
        console.log(err);
        res.status(400).json({ err });
    }
}

module.exports.checkUser = (req, res)=>{
    const token = req.cookies.jwt;
    let user = null;
    if(token){
        jwt.verify(token, 'yumeoakirameteshindekure', async(err, decodedToken)=>{
            if(err){
                console.log(err.message);
                //res.locals.user = null;
                res.json({user});
                //next();
            }else{
                user = await User.findById(decodedToken.id);
                res.json({user});
                //next();
            }
        });
    }else{
        //res.locals.user = null;
        res.json({user});
        //next();
    }
}
