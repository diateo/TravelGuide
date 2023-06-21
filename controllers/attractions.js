const Attraction = require('../models/attraction');
const { cloudinary } = require('../cloudinary');
const mapBoxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mapBoxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const attractions = await Attraction.find({});
    res.render('attractions/index',{attractions});
}

module.exports.newForm=(req, res) => {
    res.render('attractions/new');
}

module.exports.createAttraction = (async (req, res) => {
    const data=await geocoder.forwardGeocode({
        query: req.body.attraction.location,
        limit:1
    }).send()
    const attraction = new Attraction(req.body.attraction);
    attraction.geometry=data.body.features[0].geometry;
    attraction.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    attraction.owner = req.user._id;
    await attraction.save();
    req.flash('success', 'You successfully created an attraction!YAY');
    res.redirect(`/attractions/${attraction._id}`)
})

module.exports.viewAttraction=(async (req, res) => {
    const attraction = await Attraction.findById(req.params.id).populate({
        path: 'reviews', populate: { path: 'author' }
    }).populate('owner');
    if (!attraction) {
        req.flash('error', 'Cannot find the attraction');
        return res.redirect('/attractions');
    }
    res.render('attractions/show',{attraction});
})

module.exports.editForm=(async (req, res) => {
    const attraction = await Attraction.findById(req.params.id);
    if (!attraction) {
        req.flash('error', 'Cannot find the attraction');
        return res.redirect('/attractions');
    }
    res.render('attractions/edit',{attraction});
})

module.exports.updateAttraction=(async (req, res) => {
    const attraction = await Attraction.findByIdAndUpdate(req.params.id, { ...req.body.attraction });
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
    attraction.images.push(...imgs);
    await attraction.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
       await attraction.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','You have successfully update the attraction');
    res.redirect(`/attractions/${attraction._id}`);
})

module.exports.deleteAttraction=(async (req, res) => {
    await Attraction.findByIdAndDelete(req.params.id);
    req.flash('success', 'You have successfully deleted this attraction');
    res.redirect('/attractions')
})