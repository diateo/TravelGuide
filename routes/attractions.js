const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Attraction = require('../models/attraction');
const { isLoggedIn, attractionValidation, isOwner } = require('../midleware');


router.get('/', catchAsync(async (req, res) => {
    const attractions = await Attraction.find({});
    res.render('attractions/index',{attractions});
}))

//this route needs to be before show so new will not be treated as id
router.get('/new', isLoggedIn, (req, res) => {
    res.render('attractions/new');
})

router.post('/', isLoggedIn, attractionValidation, catchAsync(async (req, res) => {
    const attraction = new Attraction(req.body.attraction);
    attraction.owner = req.user._id;
    await attraction.save();
    req.flash('success', 'You successfully created an attraction!YAY');
    res.redirect(`/attractions/${attraction._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const attraction = await Attraction.findById(req.params.id).populate('reviews').populate('owner');
    if (!attraction) {
        req.flash('error', 'Cannot find the attraction');
        return res.redirect('/attractions');
    }
    res.render('attractions/show',{attraction});
}))

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(async (req, res) => {
    const attraction = await Attraction.findById(req.params.id);
    if (!attraction) {
        req.flash('error', 'Cannot find the attraction');
        return res.redirect('/attractions');
    }
    res.render('attractions/edit',{attraction});
}))

router.put('/:id', isLoggedIn, isOwner, attractionValidation, catchAsync(async (req, res) => {
    const attraction = await Attraction.findByIdAndUpdate(req.params.id, { ...req.body.attraction });
    req.flash('success','You have successfully update the attraction');
    res.redirect(`/attractions/${attraction._id}`);
}))

router.delete('/:id',isLoggedIn, isOwner, catchAsync(async (req, res) => {
    await Attraction.findByIdAndDelete(req.params.id);
    req.flash('success', 'You have successfully deleted this attraction');
    res.redirect('/attractions')
}))

module.exports = router;