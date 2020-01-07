/**
 * Action method.
 * @param {object} req - The flow request context passed in at runtime.  The
 *	 parameters are resolved as `req.params` and the available authorization
 * credentials are passed in as `req.authorizations`.
 * @param {object} outputs - A set of output callbacks.  Use it to singal an
 *	 event and pass the output result back to the runtime.  Only use an
 *	 output callback once and only after all asyncronous tasks complete.
 * @return {undefined} Callback
 */
function log(req, outputs) {
	const logger = arguments[2].logger;
	let level = req.params.level;
	if (!level) {
		level = 'trace';
	}

	if (![ 'trace', 'debug', 'warn', 'error' ].includes(level)) {
		return outputs.error(null, new Error(`invalid log level: ${level}`));
	}
	logger[level](req.params.message);
	return outputs.next();
}

module.exports = {
	log
};
