const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.status(500).send('Could not log out, please try again.');
        } else {
            res.clearCookie('connect.sid'); // This line depends on your session cookie name
            res.redirect('/login');
        }
    });
});

module.exports = router;
