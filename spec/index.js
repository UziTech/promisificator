const promisificator = require("../src");

console.log("start");

function myFunc(callback) {
	let promise;
	({
		promise,
		callback,
	} = promisificator(callback));


	/** do stuff **/
	callback(null, "test");

	return promise;
}

myFunc().then(console.log.bind(null, "promise"), console.error); // console.log("test");

myFunc((err, result) => {
	if (err) {
		return console.error(err);
	}
	console.log("callback", result);
}); // console.log("test");

console.log("end");
