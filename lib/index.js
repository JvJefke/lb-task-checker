const helpers = require("./helpers");
const CronJob = require("cron").CronJob;

/**
 * LbTaskChecker class
 * @constructor
 */
class LbTaskChecker {
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
		this.cronJob = this.startCleanupCron();
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
	reserve(task) {
		return this.model.update({ key: task.key, expires: { $lte: new Date() } }, task, { upsert: true })
			.then((updateResult) => updateResult.nUpserted > 0 || updateResult.nModified > 0)
			.catch(() => true);
	}

	/**
	 * Unreserve task (when task failed for example)
	 * @param {String} key
	 * @param {String} instance
	 *
	 * @returns {Promise} Model remove result
	 */
	unreserve(key, instance = null) {
		const req = { key };

		if (instance) {
			req.instance = instance;
		}

		return this.model.remove(req).exec();
	}

	/**
	 * Clenaup expired tasks
	 * @returns {Promise} Model remove result
	 */
	cleanup() {
		return this.model.remove({ expires: { $lte: new Date() } }).exec();
	}

	/**
	 * Create and start cronjob (removes old one if exists)
	 */
	startCleanupCron() {
		this.stopCleanupCron();

		this.cronJob = new CronJob(this.config.cronTime, () => {
			this.cleanup().catch((err) => console.log(err)); // eslint-disable-line no-console
		}, null, false, "Europe/Brussels");
	}

	/**
	 * Stop cronJob
	 */
	stopCleanupCron() {
		if (this.cronJob) {
			this.cronJob.stop();
		}
	}
}

module.exports = LbTaskChecker;
