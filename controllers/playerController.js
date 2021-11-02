const MatchHistory = require('../models/MatchHistory');
const Player = require('../models/Players');
const User = require('../models/User');
const Game = require('../models/Game');
const { getUser } = require('../users');
const jwt = require('jsonwebtoken');


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) =>{
    return jwt.sign({ id }, 'yumeoakirameteshindekure', {
        expiresIn: maxAge
    });
}

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
    try{
        await MatchHistory.createMatchHistory(user1, user2, score1, score2);
        console.log("Wsolet?");
        return;
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
        
            console.log("MAAAAAAAAAAAAAAAAAAAAAAAATCHES AREEEEEEEEEE: " + matches);
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
    }
}

module.exports.getNbRoundsWon = async (req, res) => {
    const { user1 , user2 } = req.body;
    console.log(`User 1: ${user1} User 2: ${user2}`);
    let player1wins = 0, player2wins = 0;
    let matches = await MatchHistory.find({
        $or:[
            {user1, user2},
            {user1: user2, user2: user1}
        ]
    });
    for(var i=0; i<matches.length; i++){
        if(matches[i].user1 == user1){
            if(matches[i].status1 == "Win")
                player1wins++;
            else if(matches[i].status1 == "Lose")
                player2wins++;
        }else{
            if(matches[i].status2 == "Win")
                player1wins++;
            else if(matches[i].status2 == "Lose")
                player2wins++;
        }
    }
    let matchCount = matches.length;
    console.log(`Player 1 wins: ${player1wins} Player 2 wins: ${player2wins}, Match Count: ${matchCount}`);
    res.json({player1wins, player2wins, matchCount});
}


module.exports.loginAsGuest = async (req, res) => {
    
    const {username, email, password} = generateRandomData();
    try{
        const user = await User.create({username, email, password, resetToken:"0", expireToken:Date.now(), isGuest:true});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        User.connectPlayer(user.username);
        res.status(201).json({user});
    }catch(err){
        console.log(err);
    }
}

function generateRandomData(){
    const firstNames = ["Andrew", "Ahmad", "Nirvana", "Hasan", "Ali", "Morad", "John", "Johnny", "Scarlette",
				"Maria", "Sasha", "Mikasa", "Arnold", "Christa", "Cerene", "Kamel", "Mostafa", "Imad", "Jad", "Monica",
				"Chandler", "Joey", "Phoebe", "Ross", "Reem", "Arwa", "Kindah", "Abeer", "Hanan", "Hisham", "Ayman",
				"Mohammad", "Tarek", "Tony", "Laureine", "Lisa", "Eren", "Jean", "Connie", "Levi", "Hange", "Erwin",
				"Armin", "Marco", "Historia", "Ymir", "Pieck", "Porco", "Zeke", "Gabi", "Falco", "Sophia", "Uda",
				"Reiner", "Annie", "Sarah", "Farah", "Berthodolt", "Karam", "Reda", "Johnny", "JoJo", "Jotaro", "Jonathan", "Dio", "SpeedWagon"];

	const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Black", "White", "Green", "Jones", "Gracia", "Miller",
				"Rodriguez", "Martinez", "Lopez", "Gonzales", "Wilson", "Winston", "Ackermann", "Blouse", "Springer",
				"Yaeger", "Lenz", "Fritz", "Reiss", "Zoe", "Artlert", "Kristen", "Polo", "Finger", "Galliard", "Braun",
				"Shades", "Magath", "Davis", "Taylor", "Moore", "Jackson", "Martin", "Yehya", "AlZein", "Sins", "JoeStar", "Brando" ];

    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)] + "";
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)] + "";
    const identifier = getRandomNumber();
    const username = "Guest_" + firstName + lastName + "_" + identifier;
    const email = firstName + "." + lastName + "_" + identifier + "@gmail.com";
    const password = firstName + "" + lastName + "_" + identifier;

    return {username, email, password};


}

function getRandomNumber(){
    return Math.floor(Math.random() * 10000);
}