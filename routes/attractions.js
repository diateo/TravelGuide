const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Attraction = require('../models/attraction');
const { attractionSchema} = require('../validationSchemas.js');


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

router.get('/', catchAsync(async (req, res) => {
    const attractions = await Attraction.find({});
    res.render('attractions/index',{attractions});
}))

//this route needs to be before show so new will not be treated as id
router.get('/new', (req, res) => {
    res.render('attractions/new');
})

router.post('/', attractionValidation, catchAsync(async (req, res) => {
    const attraction = new Attraction(req.body.attraction);
    await attraction.save();
    req.flash('success', 'You successfully created an attraction!YAY');
    res.redirect(`/attractions/${attraction._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const attraction = await Attraction.findById(req.params.id).populate('reviews');
    res.render('attractions/show',{attraction});
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const attraction = await Attraction.findById(req.params.id);
    res.render('attractions/edit',{attraction});
}))

router.put('/:id',attractionValidation, catchAsync(async (req, res) => {
    const attraction = await Attraction.findByIdAndUpdate(req.params.id, { ...req.body.attraction });
    res.redirect(`/attractions/${attraction._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    await Attraction.findByIdAndDelete(req.params.id);
    res.redirect('/attractions')
}))

module.exports = router;