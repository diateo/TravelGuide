const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');


const ImageSchema = new Schema({
    url: String,
    filename: String
});


ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});


const AttractionSchema = new Schema({
    name: String,
    fee: Number,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required:true
        },
        coordinates: {
            type: [Number],
            required:true
        }
    },
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