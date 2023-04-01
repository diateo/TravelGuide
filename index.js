const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Attraction = require('./models/attraction');


mongoose.connect('mongodb://127.0.0.1:27017/travel-guide')
    .then(() => {
    console.log('CONNECTION OK')
    })
    .catch(error => {
        console.log("CONNECTION FAILED!")
        console.log(error)
})
 

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    res.render('home');
})


app.get('/attractions', async (req, res) => {
    const attractions = await Attraction.find({});
    res.render('attractions/index',{attractions});
})


app.listen(3000, () => {
    console.log('Serving on port 3000');
})

