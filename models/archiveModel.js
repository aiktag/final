const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const archiveSchema = new Schema({
  title: String,
  year: String,
  type: String,
  poster: String
});

const Archive = mongoose.model('Archive', archiveSchema);

module.exports = Archive;
