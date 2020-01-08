const moment = require('moment');

/**
 * Action method.
 *
 * @param {object} req - The flow request context passed in at runtime.  The
 *	 parameters are resolved as `req.params` and the available authorization
 * credentials are passed in as `req.authorizations`.
 * @param {object} outputs - A set of output callbacks.  Use it to signal an
 *	 event and pass the output result back to the runtime.  Only use an
 *	 output callback once and only after all asyncronous tasks complete.
 *
 * @return {undefined}
 */
function formatDate(req, outputs) {
	const { date, format } = req.params;

	if (!date) {
		return outputs.error(null, new Error('Missing required parameter: date'));
	}
	if (!format) {
		return outputs.error(null, new Error('Missing required parameter: format'));
	}

	// There is no sanity check on the formats in Moment.js, so an invalid format could be
	// specified. As this is a wrapper, I won't be introducing additional format validation.
	const formattedDate = moment(date).format(format);

	// Moment doesn't throw an error if the passed in date is invalid it just returns 'Invalid date'
	if (formattedDate === 'Invalid date') {
		return outputs.error(null, new Error(`Invalid date: '${date}`));
	}

	return outputs.next(null, formattedDate);
}

module.exports = {
	formatDate
};
