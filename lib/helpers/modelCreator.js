const Schema = require("mongoose").Schema;

module.exports = (config = {}) => {
	// Get existing model if available instead of creating a new one
	if (config.mongoosee.models[config.collectionName]) {
		return config.mongoosee.models[config.collectionName];
	}

	// Create the mongoose schema
	const LbTaskSchema = new Schema(config.schema, { strict: true });

	// Set the name of the collection
	LbTaskSchema.set("collection", config.collectionName);

	return config.mongoosee.model(config.collectionName, LbTaskSchema);
};
