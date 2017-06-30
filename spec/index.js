const promisificator = require("../src");
const { promisify } = require("../src");

describe("promisificator", function () {
	beforeEach(function () {
		this.passingFunc = (arg, cb) => {
			setTimeout(_ => cb(null, arg), 1);
		};

		this.failingFunc = (arg, cb) => {
			setTimeout(_ => cb(arg), 1);
		};
	});

	it("should resolve arg from promise", function (done) {
		const { callback, promise } = promisificator();
		const arg = "arg";
		this.passingFunc(arg, callback);
		promise.then(value => {
			expect(value).toBe(arg);
			done();
		});
	});

	it("should reject arg from promise", function (done) {
		const { callback, promise } = promisificator();
		const arg = "arg";
		this.failingFunc(arg, callback);
		promise.catch(err => {
			expect(err).toBe(arg);
			done();
		});
	});

	describe("promisify", function () {
		it("should resolve arg from promisify", function (done) {
			const arg = "arg";
			promisify(this.passingFunc)(arg).then(value => {
				expect(value).toBe(arg);
				done();
			});
		});

		it("should reject arg from promisify", function (done) {
			const arg = "arg";
			promisify(this.failingFunc)(arg).catch(err => {
				expect(err).toBe(arg);
				done();
			});
		});

		it("should be able to reuse promisified function", function (done) {
			const passingAsync = promisify(this.passingFunc);
			const failingAsync = promisify(this.failingFunc);

			passingAsync(1).then(arg => {
				expect(arg).toBe(1);
				failingAsync(1).catch(arg => {
					expect(arg).toBe(1);
					passingAsync(2).then(arg => {
						expect(arg).toBe(2);
						failingAsync(2).catch(arg => {
							expect(arg).toBe(2);
							done();
						});
					});
				});
			});
		});
	});
});
