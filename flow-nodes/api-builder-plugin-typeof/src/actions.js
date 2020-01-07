/**
 * Action method.
 * @param {object} req - The flow request context passed in at runtime.  The
 *	 parameters are resolved as `req.params` and the available authorization
 * credentials are passed in as `req.authorizations`.
 * @param {object} outputs - A set of output callbacks.  Use it to signal an
 *	 event and pass the output result back to the runtime.  Only use an
 *	 output callback once and only after all asyncronous tasks complete.
 * @return {undefined} Callback
 */
function getType(req, outputs) {
	const { data } = req.params;
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
	return outputs.next(null, type);
}

module.exports = {
	getType
};
