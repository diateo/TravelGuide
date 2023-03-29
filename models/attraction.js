const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttractionSchema = new Schema({
    title: String,
    fee: String,
    location: String,
    description: String,
    
});

module.exports = mongoose.model('Attraction', AttractionSchema);