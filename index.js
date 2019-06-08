const exec = require('await-exec');
const rimraf = require('rimraf');

/**
 * This is a jim-workflow that kickstarts new projects with a git template
 */
module.exports = class JimKickoff {
	/**
	 * Kick things off
	 *
	 * @param {Object} jim The jim-object
	 */
	constructor(jim) {
		this.jim = jim;
		if (this.jim.params.length === 0) {
			this.jim.Logger.error('You have to specify which template you want to use.');
			process.exit(1);
		}

		if (!Object.prototype.hasOwnProperty.call(this.jim.workflow, this.jim.params[0])) {
			this.jim.Logger.error(`Could not find a configuration for kicking off ${this.jim.params[0]}`);
			process.exit(1);
		}

		this.config = this.jim.workflow[this.jim.params[0]];
	}

	/**
	 * The jim-run method
	 */
	async run() {
		this.jim.Logger.info(`Kicking off ${this.jim.params[0]}`);
		this.jim.Logger.info(`Using "${this.config.repo}" as a template`);
		await exec(`git clone ${this.config.repo}`);
		this.jim.Logger.success('Template cloned succesfully');
		rimraf.sync('.git');
		this.jim.Logger.success('Removed old git');
		await exec('git init');
		this.jim.Logger.success('Initialized a new git repo');
		this.jim.Logger.info('Running init script');
		const { stdout } = await exec(this.config.init);
		this.jim.Logger.info(stdout);
		this.jim.Logger.success('All done, happy coding 😎');
	}
};
