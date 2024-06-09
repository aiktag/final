const axios = require('axios');
const Film = require('../models/archiveModel.js')
const User = require("../models/userModel.js");


exports.getArchive = async (req, res) => {
    try {
        const movie = req.query.movie || "Batman";

        const apiKey = "19b30116";

        const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${movie}`;

        const response = await axios.get(url);
        const data = response.data;

        const userId = req.session.user.id;
        
        let film;

        const existingFilm = await Film.findOne({ title:  data.Search[0].Title});
        if (existingFilm){
            existingFilm.title = data.Search[0].Title;
            existingFilm.type = data.Search[0].Type;
            existingFilm.poster = data.Search[0].Poster;
            existingFilm.year = data.Search[0].Year;
            await existingFilm.save();
            film = existingFilm;
        } else{

            
            film = await Film.create({
                poster: data.Search[0].Poster,
                title: data.Search[0].Title,
                type: data.Search[0].Type,
                year: data.Search[0].Year,
            })
        }

        try {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { archiveHistory: film._id }
            });
        } catch (error) {
            console.error("Error updating user history:", error);
            return res.status(500).json({ error: 'Internal Server Error UPT' });
        }


        res.render('archive', { data, user: req.session.user });
    } catch (error) {
        console.error('Error fetching archive data:', error);
        res.render('archive', { data: null, user: req.session.user });
    }
};
