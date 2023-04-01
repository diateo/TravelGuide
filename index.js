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

//parse the body
app.use(express.urlencoded({extended:true}))


app.get('/', (req, res) => {
    res.render('home');
})


app.get('/attractions', async (req, res) => {
    const attractions = await Attraction.find({});
    res.render('attractions/index',{attractions});
})

//this route needs to be before show so new will not be treated as id
app.get('/attractions/new', (req, res) => {
    res.render('attractions/new');
})

app.post('/attractions', async (req, res) => {
    const attraction = new Attraction(req.body.attraction);
    await attraction.save();
    res.redirect(`/attractions/${attraction._id}`)
})

app.get('/attractions/:id', async (req, res) => {
    const attraction = await Attraction.findById(req.params.id);
    res.render('attractions/show',{attraction});
})



app.listen(3000, () => {
    console.log('Serving on port 3000');
})

