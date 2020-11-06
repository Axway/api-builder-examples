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
function formatDate(params) {
  const { date, format, offset } = params;

  // Defaults to now
  const momentObj = moment(date);

  if (!momentObj.isValid()) {
    throw new Error(`Invalid date: ${date}`);
  }

  if (offset) {
    const pattern = /^[+-][0-1][0-9]:[0-5][0-9]$/;
    if (offset.match(pattern)) {
      momentObj.utcOffset(offset);
    } else {
      throw new Error(`Invalid UTC offset: ${offset}`);
    }
  } else {
    momentObj.utc();
  }
  // Defaults to ISO-8601 (YYYY-MM-DDTHH:mm:ssZ)
  return momentObj.format(format);
}

module.exports = {
  formatDate
};
