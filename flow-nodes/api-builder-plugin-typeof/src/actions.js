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
async function getType(params, { logger }) {
	const { data } = params;
	// primitives: string, boolean, number, undefined, object, function, symbol, bigint
	let type = typeof data;

	// JavaScript is bugged since typeof null is 'object'
	if (data === null) {
		type = 'null';
	// Arrays are commonly treated as a different type to object
	// but JavaScript doesn't differentiate
	} else if (Array.isArray(data)) {
		type = 'array';
	}
	// Add other common object types such as Date in the future?
	return type;
}

module.exports = {
	getType
};
