const querystring = require('querystring');

function encode(req, outputs) {
	const obj = req.params.obj;
	const sep = req.params.sep;
	const eq = req.params.eq;
	if (!obj) {
		return outputs.error(null, new Error('Missing required parameter: obj'));
	}
	// passing null for sep and eq will make it use the default value
	return outputs.next(null, querystring.encode(obj, sep, eq));
}

function decode(req, outputs) {
	const str = req.params.str;
	const sep = req.params.sep;
	const eq = req.params.eq;
	if (!str) {
		return outputs.error(null, new Error('Missing required parameter: str'));
	}
	// passing null for sep and eq will make it use the default value
	return outputs.next(null, querystring.decode(str, sep, eq));
}

function escape(req, outputs) {
	const str = req.params.str;
	if (!str) {
		return outputs.error(null, new Error('Missing required parameter: str'));
	}
	return outputs.next(null, querystring.escape(str));
}

function unescape(req, outputs) {
	const str = req.params.str;
	if (!str) {
		return outputs.error(null, new Error('Missing required parameter: str'));
	}
	return outputs.next(null, querystring.unescape(str));
}

module.exports = {
	encode,
	decode,
	escape,
	unescape
};
