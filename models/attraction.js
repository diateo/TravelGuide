const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttractionSchema = new Schema({
    name: String,
    fee: Number,
    image: String,
    location: String,
    description: String,
    
});

module.exports = mongoose.model('Attraction', AttractionSchema);