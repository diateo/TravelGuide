const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = baseJoi.extend(extension);

module.exports.attractionSchema = joi.object({
    attraction: joi.object({
        name: joi.string().required().escapeHTML(),
        fee: joi.number().required().min(0),
        location: joi.string().required().escapeHTML(),
       // image: joi.string().required(),
        description:joi.string().required().escapeHTML()
    }).required(),
    deleteImages:joi.array()
});


module.exports.reviewSchema = joi.object({
    review: joi.object({
        text: joi.string().required().escapeHTML(),
        rating: joi.number().required().min(1).max(5)
    }).required()
});
