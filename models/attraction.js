const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const AttractionSchema = new Schema({
    name: String,
    fee: Number,
    images: [
        {
            url: String,
            filename:String
        }
    ],
    location: String,
    description: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});

AttractionSchema.post('findOneAndDelete', async function(document){
    if (document) {
        await Review.deleteMany({
            _id: {
                $in: document.reviews
            }
        })
    }
})

module.exports = mongoose.model('Attraction', AttractionSchema);