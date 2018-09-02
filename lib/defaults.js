module.exports.COLLECTION_NAME = "lbtasks";
module.exports.CRONTIME = "";
module.exports.MONGOOSE = require("mongoose");

module.exports.SCHEMA = {
	key: {
		type: String,
		required: true,
		index: true,
		unique: true,
	},
	expires: {
		type: Date,
		required: true,
	},
	created: {
		type: Date,
		required: true,
		default: Date.now,
	},
	instance: {
		type: String,
		required: false,
	},
};
