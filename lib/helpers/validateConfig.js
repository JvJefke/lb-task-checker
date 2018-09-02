const Joi = require("joi");
const DEFAULTS = require("../defaults");

const ConfigSchema = Joi.object().keys({
	collectionName: Joi.string().required(),
	schema: Joi.object().required(),
	cronTime: Joi.string().required(),
	mongoose: Joi.object().required(),
});

module.exports = (config = {
	collectionName: DEFAULTS.COLLECTION_NAME,
	schema: DEFAULTS.SCHEMA,
	cronTime: DEFAULTS.CRONTIME,
	mongoose: DEFAULTS.MONGOOSE,
}) => {
	return Joi.validate(config, ConfigSchema);
};
