const axios = require('axios');
const User = require('../models/userModel');
const Country = require('../models/countryModel')

exports.getCountryByName = async (req, res) => {
    const countryName = req.query.countryName || "Kazakhstan";
    
    try {

        const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
        const country = response.data;

        const userId = req.session.user.id;
        
        let c;

        const existingC = await Country.findOne({ name:  country[0].name.common});
        if (existingC){
            existingC.name = country[0].name.common;
            existingC.capital = country[0].capital;
            existingC.population = country[0].population.toLocaleString();
            existingC.fifa = country[0].fifa;
            existingC.timezones = country[0].timezones[0],
            existingC.area = country[0].area,
            existingC.region = country[0].region
            await existingC.save();
            c = existingC;
        } else{

            
            c = await Country.create({
                name:  country[0].name.common,
                capital: country[0].capital,
                population: country[0].population.toLocaleString(),
                fifa: country[0].fifa,
                timezones:country[0].timezones[0],
                area: country[0].area,
                region:country[0].region,
            })
        }

        try {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { countryHistory: c._id }
            });
        } catch (error) {
            console.error("Error updating user history:", error);
            return res.status(500).json({ error: 'Internal Server Error UPT' });
        }
        res.render('country', { country, user: req.session.user  });
    } catch (error) {
        console.error('Error fetching country:', error);
        res.render('country', { country: null, error: 'Failed to fetch country', user: req.session.user  });
    }
};
