const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const addUser = async (req, res) => {
    try {
        const { username, email, password, admin } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword,
            admin: !!admin,
        });
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.send('Error adding user');
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.send('Error deleting user');
    }
};

const editUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('editUser', { user });
    } catch (error) {
        console.error(error);
        res.send('Error fetching user details');
    }
};

const updateUser = async (req, res) => {
    const { username, email, admin } = req.body;
    try {
        await User.findByIdAndUpdate(req.params.userId, {
            username,
            email,
            admin: !!admin, // Convert to boolean
        });
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.send('Error updating user');
    }
};


module.exports = {
    addUser,
    deleteUser,
    editUser,
    updateUser,
};