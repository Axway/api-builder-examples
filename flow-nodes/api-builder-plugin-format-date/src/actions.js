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
	let { date, format, offset } = params;

  let formattedDate;
  let dateString = (!date) ? date : date.toString(); // Convert any date input such as "new Date('2020-01-08T13:24:40+02:00')" to a string.
  let dateWithNoOrdinal = (!date) ? date : dateString.replace(/(\d+)(st|nd|rd|th)/, "$1");
  let dateMoment = moment(dateWithNoOrdinal);
  let isDate = dateMoment.isValid();
  let formatWithNoOrdinal = (!format) ? format : format.replace(/Do/g, 'D');

  if (!date && !format) {
    if (offset) {
      formattedDate = moment().utcOffset(offset).format();
    } else {
      formattedDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    }
	}

  else if (isDate === true && !format) {
    if (!offset) {
      formattedDate = dateMoment.format();
    } else {
      formattedDate = dateMoment.utcOffset(offset).format();
    }
  }
  // Format current date (if date parameter not entered) based on the format entered.
  else if (!date && format) {
    // Verify if the current date to be formatted will be a valid date after the passed in format is applied.
    let dateOutputToBe = moment().format(formatWithNoOrdinal);
    let isValidDateFormat = moment(moment(dateOutputToBe).format()).isValid();

    if (isValidDateFormat === true) {
      formattedDate = moment().format(format);
    } else {
      throw new Error(`Invalid Format: '${format}`);
    }
  }
  // Format the entered date based on the format entered
  else if (isDate === true && format) {
    // Verify if the entered date to be formatted will be a valid date after the entered format is applied.
    let dateOutputToBe = moment(dateWithNoOrdinal).format(formatWithNoOrdinal);
    let isValidDateFormat = moment(moment(dateOutputToBe).format()).isValid();

    if (isValidDateFormat === true) {
      formattedDate = moment(dateWithNoOrdinal).format(format);
    } else {
      throw new Error(`Invalid Format: '${format}`);
    }
  }

  else {
    throw new Error(`Invalid Date: '${date}`);
  }

  return formattedDate;
}

module.exports = {
	formatDate
};
