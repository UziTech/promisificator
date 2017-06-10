const promisificator = require("../src");

describe("promisificator", function () {
	beforeEach(function () {
		this.passingFunc = (arg, cb) => {
			setTimeout(_ => cb(null, arg), 1);
		};

		this.failingFunc = (arg, cb) => {
			setTimeout(_ => cb(arg), 1);
		};
	});

	it("should resolve arg from promise", function(done) {
		const { callback, promise } = promisificator();
		const arg = "arg";
		this.passingFunc(arg, callback);
		promise.then(value => {
			expect(value).toBe(arg);
			done();
		});
	});

	it("should reject arg from promise", function(done){
		const { callback, promise } = promisificator();
		const arg = "arg";
		this.failingFunc(arg, callback);
		promise.catch(err => {
			expect(err).toBe(arg);
			done();
		});
	});

	it("should resolve arg from promisify", function(done) {
		const { promisify } = promisificator();
		const arg = "arg";
		promisify(this.passingFunc)(arg).then(value => {
			expect(value).toBe(arg);
			done();
		});
	});

	it("should reject arg from promisify", function(done){
		const { promisify } = promisificator();
		const arg = "arg";
		promisify(this.failingFunc)(arg).catch(err => {
			expect(err).toBe(arg);
			done();
		});
	});
});
