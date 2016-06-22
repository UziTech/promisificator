const promisificator = (callback) => {
	return (resolve, reject) => {
		callback = (err, value) => {
			if (err) {
				reject(err);
			} else if (arguments.length === 2) {
				resolve(value);
			} else {
				let values = Array.from(arguments).slice(1);
				resolve(values);
			}
		};
	};
};
