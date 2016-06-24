"use strict";

const promisificator = (callback) => {
	let promise;
	if (typeof callback === "undefined") {
		promise = new Promise((resolve, reject) => {
			callback = function(err, value) {
				if (err) {
					reject(err);
				} else if (arguments.length <= 2) {
					resolve(value);
				} else {
					let values = Array.from(arguments).slice(1);
					resolve(values);
				}
			};
		});
	}
	return {
		promise,
		callback,
	};
};

module.exports = promisificator;
