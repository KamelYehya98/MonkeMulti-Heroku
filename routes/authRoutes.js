const {Router} = require('express');
const authController = require('../controllers/authController.js');
const playerController = require('../controllers/playerController');


const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.post('/logout', authController.logout_post);
router.post('/forgot', authController.forgot_post);
router.post('/reset/:token', authController.reset_post);
router.post('/createroom', authController.createroom_post);
router.post('/joinroom', authController.joinroom_post);
router.post('/checkuser', authController.checkUser);
router.post('/getstats', playerController.getStats);
module.exports = router;