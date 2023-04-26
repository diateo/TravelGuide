const express = require('express');
const router = express.Router();
const attractions = require('../controllers/attractions');
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, attractionValidation, isOwner } = require('../midleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads' });


router.route('/')
    .get(catchAsync(attractions.index))
// .post(isLoggedIn, attractionValidation, catchAsync(attractions.createAttraction))
    .post(upload.single('image'),(req, res)=> {
        console.log(req.body, req.file);
        res.send('it worked ');
    })

router.get('/new', isLoggedIn, attractions.newForm);

router.route('/:id')
    .get(catchAsync(attractions.viewAttraction))
    .put(isLoggedIn, isOwner, attractionValidation, catchAsync(attractions.updateAttraction))
    .delete(isLoggedIn, isOwner, catchAsync(attractions.deleteAttraction))


router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(attractions.editForm));


module.exports = router;