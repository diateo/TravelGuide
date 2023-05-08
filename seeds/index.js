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
        const fee = Math.floor(Math.random() * 30) + 10;
        const attraction = new Attraction({
            owner: '6447b4542ff992a202b04df7',
            location: `${cities[randomCity].city}, ${cities[randomCity].county}`,
            name: `${randomSeed(adjectives)} ${randomSeed(places)}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus vitae omnis officiis praesentium a consequuntur perspiciatis nesciunt officia hic non ipsum voluptatum saepe magnam necessitatibus suscipit doloribus quae, quaerat quos! Fugit impedit ipsam eveniet odio exercitationem inventore porro facilis temporibus! Praesentium, inventore autem error delectus, atque consequatur accusamus cupiditate obcaecati veritatis ullam aperiam nisi ratione, in odio iste quisquam soluta? Incidunt quia exercitationem est dolore totam?',
            fee,
            geometry: { type: 'Point', coordinates: [ 27.583614, 47.161534 ] },
            images: [
                {
                    url: 'https://res.cloudinary.com/dylm9rjsl/image/upload/v1682597960/TravelGuide/dtymw6jkwcjxpwh2fzbv.jpg',
                    filename: 'TravelGuide/dtymw6jkwcjxpwh2fzbv'
                },
                {
                    url: 'https://res.cloudinary.com/dylm9rjsl/image/upload/v1682597955/TravelGuide/x8x0ukavstfokvttnrcb.jpg',
                    filename: 'TravelGuide/x8x0ukavstfokvttnrcb'
                },
                {
                    url: 'https://res.cloudinary.com/dylm9rjsl/image/upload/v1682597951/TravelGuide/ubpdzyaj9kbnjojjvsue.jpg',
                    filename: 'TravelGuide/ubpdzyaj9kbnjojjvsue'
                },
                {
                    url: 'https://res.cloudinary.com/dylm9rjsl/image/upload/v1682597942/TravelGuide/aios3xtjotc6uhmdcgpg.jpg',
                    filename: 'TravelGuide/aios3xtjotc6uhmdcgpg'
                }
            ]
            
        });
        await attraction.save();
    }
}

populateDB().then(() => {
    mongoose.connection.close();
});