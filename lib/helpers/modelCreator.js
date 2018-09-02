const Schema = require("mongoose").Schema;

module.exports = (config = {}) => {
	// Get existing model if available instead of creating a new one
	if (config.mongoose.models[config.collectionName]) {
		return config.mongoose.models[config.collectionName];
	}

	// Create the mongoose schema
	const LbTaskSchema = new Schema(config.schema, { strict: true });

	// Set the name of the collection
	LbTaskSchema.set("collection", config.collectionName);

	return config.mongoose.model(config.collectionName, LbTaskSchema);
};
