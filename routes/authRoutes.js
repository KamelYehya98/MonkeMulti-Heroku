const {Router} = require('express');
const authController = require('../controllers/authController.js');
const playerController = require('../controllers/playerController');


const router = Router();

router.post('/signup', authController.signup_post);
router.post('/login_post', authController.login_post);
router.post('/logout', authController.logout_post);
router.post('/forgot', authController.forgot_post);
router.post('/reset/:token', authController.reset_post);
router.post('/createroom', authController.createroom_post);
router.post('/joinroom', authController.joinroom_post);
router.post('/deleteroom', authController.deleteroom_post);
router.post('/checkuser', authController.checkUser);

router.post('/getstats', playerController.getStats);
router.post('/getmatchhistory', playerController.getMatchHistory);
router.post('/getgamehistory', playerController.getGameHistory);
router.post('/creatematchhistory', playerController.createMatchHistory);
router.post('/getlatestroundresult', playerController.getLatestRoundResult);
router.post('/getusername', playerController.getUsername);

module.exports = router;