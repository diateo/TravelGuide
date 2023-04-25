const { attractionSchema,reviewSchema } = require('./validationSchemas');
const ExpressError = require('./utilities/ExpressError');
const Attraction = require('./models/attraction');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

//create midleware for the JOI validation schema 
module.exports.attractionValidation = (req, res, next) => {
    const {error} = attractionSchema.validate(req.body);
    if (error) {
        const finalMessage = error.details.map(msg => msg.message).join(',');
        throw new ExpressError(400, finalMessage);
    }
    else {
        next();
    }
}

module.exports.reviewValidation = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const finalMessage = error.details.map(msg => msg.message).join(',');
        throw new ExpressError(400, finalMessage);
    }
    else {
        next();
    }
}


module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const attraction = await Attraction.findById(id);
    if (!attraction.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/attractions/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/attractions/${id}`);
    }
    next();
}