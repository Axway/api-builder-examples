const moment = require('moment');

/**
 * Action method.
 *
 * @param {object} params - A map of all the parameters passed from the flow.
 * @param {object} options - The additional options provided from the flow
 *	 engine.
 * @param {object} options.pluginConfig - The service configuration for this
 *	 plugin from API Builder config.pluginConfig['api-builder-plugin-pluginName']
 * @param {object} options.logger - The API Builder logger which can be used
 *	 to log messages to the console. When run in unit-tests, the messages are
 *	 not logged.  If you wish to test logging, you will need to create a
 *	 mocked logger (e.g. using `simple-mock`) and override in
 *	 `MockRuntime.loadPlugin`.  For more information about the logger, see:
 *	 https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/logging.html
 * @param {*} [options.pluginContext] - The data provided by passing the
 *	 context to `sdk.load(file, actions, { pluginContext })` in `getPlugin`
 *	 in `index.js`.
 * @return {*} The response value (resolves to "next" output, or if the method
 *	 does not define "next", the first defined output).
 */
function formatDate(params, { logger }) {
	const { date, format } = params;

	if (!date) {
		logger.error('The date parameter is missing.');
		throw new Error('Missing required parameter: date');
	}
	if (!format) {
		logger.error('The format parameter is missing.');
		throw new Error('Missing required parameter: format');
	}

	// There is no sanity check on the formats in Moment.js, so an invalid format could be
	// specified. As this is a wrapper, I won't be introducing additional format validation.
	const formattedDate = moment(date).format(format);

	// Moment doesn't throw an error if the passed in date is invalid it just returns 'Invalid date'
	if (formattedDate === 'Invalid date') {
		logger.error('Invalid date');
		throw new Error(`Invalid date: '${date}`);
	}
	return formattedDate;
}

module.exports = {
	formatDate
};
