const {Router} = require('express');
const authController = require('../controllers/authController.js');



const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.post('/forgot', authController.forgot_post);
router.post('/reset/:token', authController.reset_post);
router.post('/createroom', authController.createroom_post);
router.post('/joinroom', authController.joinroom_post);

module.exports = router;