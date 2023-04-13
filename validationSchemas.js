const joi = require('joi');

module.exports.attractionSchema = joi.object({
    attraction: joi.object({
        name: joi.string().required(),
        fee: joi.number().required().min(0),
        location: joi.string().required(),
        image: joi.string().required(),
        description:joi.string().required()
    }).required()
});

