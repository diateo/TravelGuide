const mongoose = require('mongoose');
const Attraction = require('../models/attraction');
const cities = require('./cities')
const {adjectives,places}=require('./imaginaryAttractions')


mongoose.connect('mongodb://127.0.0.1:27017/travel-guide')
    .then(() => {
    console.log('CONNECTION OK')
    })
    .catch(error => {
        console.log("CONNECTION FAILED!")
        console.log(error)
})
 
const randomSeed = array => array[Math.floor(Math.random() * array.length)];

const populateDB = async () => {
    await Attraction.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomCity = Math.floor(Math.random() * 800);
        const attraction = new Attraction({
            location: `${cities[randomCity].city}, ${cities[randomCity].county}`,
            name:`${randomSeed(adjectives)} ${randomSeed(places)}`
        });
        await attraction.save();
    }
}

populateDB().then(() => {
    mongoose.connection.close();
});