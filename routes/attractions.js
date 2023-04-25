const express = require('express');
const router = express.Router();
const attractions = require('../controllers/attractions');
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, attractionValidation, isOwner } = require('../midleware');


router.get('/', catchAsync(attractions.index));

//this route needs to be before show so new will not be treated as id
router.get('/new', isLoggedIn, attractions.newForm);

router.post('/', isLoggedIn, attractionValidation, catchAsync(attractions.createAttraction));

router.get('/:id', catchAsync(attractions.viewAttraction));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(attractions.editForm));

router.put('/:id', isLoggedIn, isOwner, attractionValidation, catchAsync(attractions.updateAttraction));

router.delete('/:id', isLoggedIn, isOwner, catchAsync(attractions.deleteAttraction));

module.exports = router;