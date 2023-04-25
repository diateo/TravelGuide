const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews');
const catchAsync = require('../utilities/catchAsync');
const Review = require('../models/review');
const Attraction = require('../models/attraction');
const {reviewValidation, isLoggedIn, isReviewAuthor} = require('../midleware');


router.post('/', isLoggedIn, reviewValidation, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;