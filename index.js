const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Attraction = require('./models/attraction');
const Review = require('./models/review');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const { attractionSchema } = require('./validationSchemas.js');


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

//create midleware for the JOI validation schema 
const attractionValidation = (req, res, next) => {
    const {error} = attractionSchema.validate(req.body);
    if (error) {
        const finalMessage = error.details.map(msg => msg.message).join(',');
        throw new ExpressError(400, finalMessage);
    }
    else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
})


app.get('/attractions', catchAsync(async (req, res) => {
    const attractions = await Attraction.find({});
    res.render('attractions/index',{attractions});
}))

//this route needs to be before show so new will not be treated as id
app.get('/attractions/new', (req, res) => {
    res.render('attractions/new');
})

app.post('/attractions', attractionValidation, catchAsync(async (req, res) => {
    const attraction = new Attraction(req.body.attraction);
    await attraction.save();
    res.redirect(`/attractions/${attraction._id}`)
}))

app.get('/attractions/:id', catchAsync(async (req, res) => {
    const attraction = await Attraction.findById(req.params.id);
    res.render('attractions/show',{attraction});
}))

app.get('/attractions/:id/edit', catchAsync(async (req, res) => {
    const attraction = await Attraction.findById(req.params.id);
    res.render('attractions/edit',{attraction});
}))

app.put('/attractions/:id',attractionValidation, catchAsync(async (req, res) => {
    const attraction = await Attraction.findByIdAndUpdate(req.params.id, { ...req.body.attraction });
    res.redirect(`/attractions/${attraction._id}`);
}))

app.delete('/attractions/:id', catchAsync(async (req, res) => {
    await Attraction.findByIdAndDelete(req.params.id);
    res.redirect('/attractions')
}))

app.post('/attractions/:id/reviews', catchAsync(async (req, res) => {
    const attraction = await Attraction.findById(req.params.id);
    const review = new Review(req.body.review);
    attraction.reviews.push(review);
    await review.save();
    await attraction.save();
    res.redirect(`/attractions/${attraction._id}`);

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

