const path = require('path');
const sdk = require('@axway/api-builder-sdk');
const actions = require('./actions');

/**
 * Resolves the API Builder plugin.
 * @returns {object} An API Builder plugin.
 */
function getPlugin() {
	return sdk
		.init(module)
		.load(path.join('src', 'flow-nodes.yml'), actions);
}

module.exports = getPlugin;
