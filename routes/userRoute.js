const express = require('express');
const { getAllUser, login, signup,getSignUp,getLogin,getCombinedHistory} = require('../controllers/userController');

const router = express.Router()
router.get("/getAllUser", getAllUser )
router.get('/', getSignUp);
router.get('/login', getLogin);
router.get('/history',getCombinedHistory);
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
