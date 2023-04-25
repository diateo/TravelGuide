const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utilities/catchAsync');
const Review = require('../models/review');
const Attraction = require('../models/attraction');
const {reviewValidation, isLoggedIn} = require('../midleware');


router.post('/',isLoggedIn, reviewValidation, catchAsync(async (req, res) => {
    const attraction = await Attraction.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    attraction.reviews.push(review);
    await review.save();
    await attraction.save();
    req.flash('success', 'You have successfully created a new review');
    res.redirect(`/attractions/${attraction._id}`);

}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Attraction.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'You have successfully deleted this review');
    res.redirect(`/attractions/${id}`);
}))

module.exports = router;