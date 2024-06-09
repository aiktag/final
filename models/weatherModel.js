const mongoose = require('mongoose');

const Schema = mongoose.Schema

const weatherSchema = new Schema({
    city: {
        type: String,
        required: true,
    },
    temperature: {
        type: Number,
    },
    pressure: {
        type: Number,
    },
    humidity: {
        type: Number,
    },
    windSpeed:{
        type:Number,
    },
    icon:{
        type:String,
    },
    longitude:{
        type:Number,
    },
    latitiude:{
        type:Number,
    }
},{timestamps: true})

const WeatherData = mongoose.model('Weather', weatherSchema);

module.exports = WeatherData;