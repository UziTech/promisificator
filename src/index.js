const promisificator = (cb) => {
	let promise, callback;
	switch (typeof cb) {
		case "undefined":
			promise = new Promise((resolve, reject) => {
				callback = function (err, value) {
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
			break;
		case "function":
			callback = function () {
				process.nextTick(cb, ...arguments);
			};
			break;
		default:
			throw new Error("First argument must be a function or undefined.");
	}

	return {
		promise,
		callback,
	};
};

promisificator.promisify = function (func) {
	return function () {
		const { promise, callback } = promisificator();
		let args = Array.from(arguments);
		let undef;
		while (args.length < func.length - 1) {
			args.push(undef);
		}
		args.push(callback);
		func.apply(null, args);
		return promise;
	};
};

module.exports = promisificator;
