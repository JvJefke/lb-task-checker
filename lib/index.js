const helpers = require("./helpers");
const DEFAULTS = require("./defaults");

/**
 * LbTaskChecker class
 * @constructor
 */
class LbTaskChecker {
	static getDefaults() {
		return DEFAULTS;
	}

	/**
	 * @param {Object} [config={}] Config object
	 * @param {Object} [config.mongoose] use existing mongoose instance
	 * @param {String} [config.collectionName="lbtasks"] Collection name to store tasks in
	 * @param {Object} [config.schema] Task mongoose schema
	 * @param {String} [config.cronTime] Cron time
	 *
	 * @returns {LbTaskChecker} LbTaskChecker instance
	 */
	constructor(config) {
		const validatedResult = helpers.validateConfig(config);

		if (validatedResult.error) {
			throw validatedResult.error;
		}

		this.config = validatedResult.value;
		this.model = helpers.modelCreator(this.config);
	}

	/**
	 * Register Task
	 * @param {Object} task Task object to be stored or checked against
	 * @param {String} task.key Unique key of the task
	 * @param {String} [task.instance] Identifier for the instance that has reserved the task
	 *
	 * @returns {Promise} True => Task is reserved for the instance, False => Task is already reserved by another instance
	 */
	registerTask(task) {
		return this.model.update({ key: task.key }, task, { upsert: true }).exec();
	}

	/**
     * Unregister task
     */
	unregisterTask(key) {
		return this.model.remove({ key });
	}

	/**
	 * Check if task has been run already by another instance
	 * @param {Object} task Task object to be stored or checked against
	 * @param {String} task.key Unique key of the task
	 * @param {Date} task.expires Date on which the task should be expired
	 * @param {String} [task.instance] Identifier for the instance that has reserved the task
	 *
	 * @returns {Boolean} True => Task is reserved for the instance, False => Task is already reserved by another instance
	 */
	reserve(key, expires, instance) {
		return this.model.update({ key: key, expires: { $lte: new Date() } }, { $set: { expires, instance } })
			.then((updateResult) => updateResult.nModified > 0)
			.catch(() => false);
	}

	/**
	 * Unreserve task (when task failed for example)
	 * @param {String} key
	 * @param {String} instance
	 *
	 * @returns {Promise} Model remove result
	 */
	unreserve(key, instance = null) {
		return this.model.update({ key }, { $set: { expires: new Date(), instance } });
	}
}

module.exports = LbTaskChecker;
