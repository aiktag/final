const User = require("../models/userModel.js");
const Weather = require("../models/weatherModel.js");
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail } = require('../utils/nodemailer.js');

const getAllUser = async (req, res, next) => {
    let users
    try {
        users = await User.find()
    } catch (err) {
        console.log(err)
    }
    if (!users) {
        return res.status(404).json({ message: "no users found" })
    }
    return res.status(200).json({ users })
}

const signup = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    let existingUser;
    try {
        existingUser = await User.findOne({ email })
    } catch (err) {
        return console.log(err)
    }
    if (existingUser) {
        return res.status(400).json({ message: "user already exists" })
    }
    const hashedPassword = bcrypt.hashSync(password)
    const user = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await user.save();
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
        };
        sendWelcomeEmail(user.email, user.username); 
        req.session.save(err => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Session error, please try again." });
            }
            res.redirect('/weather');
        });
    } catch (err) {
        return console.log(err)
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            req.flash('error', 'User not found by this email');
            return res.redirect('/login');
        }

        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordCorrect) {
            req.flash('error', 'Incorrect password');
            return res.redirect('/login');
        }

        req.session.user = { id: existingUser._id, admin: existingUser.admin, username: existingUser.username };

        req.session.save(err => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Session error, please try again." });
            }
            return res.redirect(existingUser.admin ? '/admin' : '/weather');
        });
    } catch (err) {
        req.flash('error', 'Login error, please try again.');
        res.redirect('/login');
    }
}


const getCombinedHistory = async (req, res, next) => {
    if (req.session && req.session.user) {
        const userId = req.session.user.id;
        try {
            // Assuming both histories are fields in the User model
            const user = await User.findById(userId).populate('history archiveHistory countryHistory');
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.render('history', { user: user, history: user.history, archiveHistory: user.archiveHistory, countryHistory: user.countryHistory });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching user history" });
        }
    } else {
        return res.redirect('/login');
    }
};


const getSignUp = async (req, res, next) => {
    res.render('signup');
}

const getLogin = async (req, res, next) => {
    res.render('login');
}

module.exports = {
    getAllUser,
    getSignUp,
    getLogin,
    signup,
    login,
    getCombinedHistory,
};