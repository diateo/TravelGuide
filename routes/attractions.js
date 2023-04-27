const express = require('express');
const router = express.Router();
const attractions = require('../controllers/attractions');
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, attractionValidation, isOwner } = require('../midleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({storage});


router.route('/')
    .get(catchAsync(attractions.index))
    .post(isLoggedIn, upload.array('image'), attractionValidation, catchAsync(attractions.createAttraction))
    

router.get('/new', isLoggedIn, attractions.newForm);

router.route('/:id')
    .get(catchAsync(attractions.viewAttraction))
    .put(isLoggedIn, isOwner, upload.array('image'), attractionValidation, catchAsync(attractions.updateAttraction))
    .delete(isLoggedIn, isOwner, catchAsync(attractions.deleteAttraction))


router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(attractions.editForm));


module.exports = router;