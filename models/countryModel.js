const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countrySchema = new Schema({
  name: String,
  population: String,
  region: String,
  fifa: String,
  timezones: String,
  area: String,
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
