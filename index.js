const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Attraction = require('./models/attraction');
const Review = require('./models/review');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const {reviewSchema } = require('./validationSchemas.js');

const attractions = require('./routes/attractions');


mongoose.connect('mongodb://127.0.0.1:27017/travel-guide')
    .then(() => {
    console.log('CONNECTION OK')
    })
    .catch(error => {
        console.log("CONNECTION FAILED!")
        console.log(error)
})
 

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//parse the body
app.use(express.urlencoded({ extended: true }));
//because the browser form doesn't support PUT/PATCH/DELETE
app.use(methodOverride('_method'));



const reviewValidation = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const finalMessage = error.details.map(msg => msg.message).join(',');
        throw new ExpressError(400, finalMessage);
    }
    else {
        next();
    }
}

app.use('/attractions', attractions);

app.get('/', (req, res) => {
    res.render('home');
})


app.post('/attractions/:id/reviews', reviewValidation, catchAsync(async (req, res) => {
    const attraction = await Attraction.findById(req.params.id);
    const review = new Review(req.body.review);
    attraction.reviews.push(review);
    await review.save();
    await attraction.save();
    res.redirect(`/attractions/${attraction._id}`);

}))

app.delete('/attractions/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Attraction.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/attractions/${id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found'));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error',{err});
})


app.listen(3000, () => {
    console.log('Serving on port 3000');
})

