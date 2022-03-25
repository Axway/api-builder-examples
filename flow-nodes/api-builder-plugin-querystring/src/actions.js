const querystring = require('querystring');
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

async function encode(params, { logger }) {
	const { obj, sep, eq } = params;

	if (!obj) {
		logger.error('The obj parameter is missing.');
		throw new Error('Missing required parameter: obj');
	}
	// passing null for sep and eq will make it use the default value
	return querystring.encode(obj, sep, eq);
}

async function decode(params, { logger }) {
	const { str, sep, eq } = params;

	if (!str) {
		logger.error('The str parameter is missing.');
		throw new Error('Missing required parameter: str');
	}
	// passing null for sep and eq will make it use the default value
	return querystring.decode(str, sep, eq);
}

async function escape(params, { logger }) {
	const { str } = params;
	if (!str) {
		logger.error('The str parameter is missing.');
		throw new Error('Missing required parameter: str');
	}
	return querystring.escape(str);
}

async function unescape(params, { logger }) {
	const { str } = params;
	if (!str) {
		logger.error('The str parameter is missing.');
		throw new Error('Missing required parameter: str');
	}
	return querystring.unescape(str);
}

module.exports = {
	encode,
	decode,
	escape,
	unescape
};
