const crypto = require('crypto');

function digest(req, outputs) {
	const { data } = req.params;
	if (data === undefined || data === null) {
		return outputs.error(null, new Error('invalid argument: data'));
	}
	const hash = crypto
		.createHash('md5')
		.update(data)
		.digest('hex');
	outputs.next(null, hash);
}

module.exports = {
	digest
};
