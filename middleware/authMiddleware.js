const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt; //getting the jwt ccokie
    //check if token exists and valid
    if(token){
        jwt.verify(token, 'yumeoakirameteshindekure', (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }else{
        res.redirect('/login');
    }
}

//check current user
const checkUser = (req, res, next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'yumeoakirameteshindekure', async(err, decodedToken)=>{
            if(err){
                console.log(err.message);
                //res.locals.user = null;
                res.json({user});
                next();
            }else{
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.json({user});
                next();
            }
        });
    }else{
        //res.locals.user = null;
        res.json({user});
        next();
    }
}

module.exports = { requireAuth, checkUser };