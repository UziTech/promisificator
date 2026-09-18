const assert = require("node:assert/strict");
const {beforeEach, describe, test} = require("node:test");

const promisificator = require("../src");
const {promisify} = promisificator;

describe("promisificator", () => {
	let passingFunc, failingFunc;
	beforeEach(() => {
		passingFunc = (arg, cb) => {
			setTimeout(() => cb(null, arg), 1);
		};

		failingFunc = (arg, cb) => {
			setTimeout(() => cb(arg), 1);
		};
	});

	test("should resolve arg from promise", async () => {
		const {callback, promise} = promisificator();
		const arg = "arg";
		passingFunc(arg, callback);
		const value = await promise;
		assert.strictEqual(value, arg);
	});

	test("should reject arg from promise", async () => {
		const {callback, promise} = promisificator();
		const arg = "arg";
		failingFunc(arg, callback);
		await assert.rejects(promise, error => error === arg);
	});

	test("should call callback with args after tick", (done) => {
		const calls = [];
		const cb = (...args) => {
			calls.push(args);
			return args[0];
		};
		const {callback, promise} = promisificator(cb);
		const arg = "arg";
		callback(arg);
		assert.strictEqual(calls.length, 0);
		assert.strictEqual(promise, undefined);
		process.nextTick(() => {
			assert.deepStrictEqual(calls, [[arg]]);
			done();
		});
	});

	test("should not use nextTick to call the callback", () => {
		const calls = [];
		const cb = (...args) => {
			calls.push(args);
			return args[0];
		};
		const {callback, promise} = promisificator(cb, {useNextTick: false});
		const arg = "arg";
		callback(arg);
		assert.strictEqual(calls.length, 1);
		assert.strictEqual(promise, undefined);
	});

	test("should throw if invalid type", () => {
		assert.throws(() => promisificator(1), Error);
	});

	test("should allow options as first argument", async () => {
		const {callback, promise} = promisificator({rejectOnError: false});
		const arg = "arg";
		failingFunc(arg, callback);
		const value = await promise;
		assert.strictEqual(value, arg);
	});

	test("should allow options as second argument with null callback", async () => {
		const {callback, promise} = promisificator(null, {rejectOnError: false});
		const arg = "arg";
		failingFunc(arg, callback);
		const value = await promise;
		assert.strictEqual(value, arg);
	});

	test("should resolve arg if rejectOnError is false", async () => {
		const {callback, promise} = promisificator({rejectOnError: false});
		const arg = "arg";
		failingFunc(arg, callback);
		const value = await promise;
		assert.strictEqual(value, arg);
	});

	test("should resolve [arg] if alwaysReturnArray is true", async () => {
		const {callback, promise} = promisificator({alwaysReturnArray: true});
		const arg = "arg";
		passingFunc(arg, callback);
		const value = await promise;
		assert.deepStrictEqual(value, [arg]);
	});

	test("should resolve [arg] if alwaysReturnArray is true and rejectOnError is false", async () => {
		const {callback, promise} = promisificator({rejectOnError: false, alwaysReturnArray: true});
		const arg = "arg";
		failingFunc(arg, callback);
		const value = await promise;
		assert.deepStrictEqual(value, [arg]);
	});

	describe("promisify", () => {
		test("should resolve arg from promisify", async () => {
			const arg = "arg";
			const value = await promisify(passingFunc)(arg);
			assert.strictEqual(value, arg);
		});

		test("should resolve arg from promisify", async () => {
			const value = await promisify(passingFunc)();
			assert.strictEqual(value, undefined);
		});

		test("should reject arg from promisify", async () => {
			const arg = "arg";
			await assert.rejects(promisify(failingFunc)(arg), error => error === arg);
		});

		test("should be able to reuse promisified function", async () => {
			const passingAsync = promisify(passingFunc);
			const failingAsync = promisify(failingFunc);
			let err;
			let value;

			value = await passingAsync(1);
			assert.strictEqual(value, 1);

			await assert.rejects(failingAsync(1), error => {
				err = error;
				return error === 1;
			});
			assert.strictEqual(err, 1);

			value = await passingAsync(2);
			assert.strictEqual(value, 2);

			await assert.rejects(failingAsync(2), error => {
				err = error;
				return error === 2;
			});
			assert.strictEqual(err, 2);
		});

		test("should resolve arg if rejectOnError is false", async () => {
			const arg = "arg";
			const value = await promisify(failingFunc, {rejectOnError: false})(arg);
			assert.strictEqual(value, arg);
		});

		test("should resolve [arg] if alwaysReturnArray is true", async () => {
			const arg = "arg";
			const value = await promisify(passingFunc, {alwaysReturnArray: true})(arg);
			assert.deepStrictEqual(value, [arg]);
		});

		test("should resolve [arg] if alwaysReturnArray is true and rejectOnError is false", async () => {
			const arg = "arg";
			const value = await promisify(failingFunc, {rejectOnError: false, alwaysReturnArray: true})(arg);
			assert.deepStrictEqual(value, [arg]);
		});

		describe("callbackArg option", () => {
			let	middleCallback, agumentsCallback;
			beforeEach(() => {
				middleCallback = (arg, cb, arg1) => {
					setTimeout(() => cb(null, arg, arg1), 1);
				};
				agumentsCallback = (...args) => {
					const cb = args.pop();
					setTimeout(() => cb(null, ...args), 1);
				};
			});

			test("should set the callback arg according to callbackArg", async () => {
				const arg = "arg";
				const arg1 = "arg1";
				const value = await promisify(middleCallback, {callbackArg: 1})(arg, null, arg1);
				assert.deepStrictEqual(value, [arg, arg1]);
			});

			test("should set the callback arg according to negative callbackArg", async () => {
				const arg = "arg";
				const arg1 = "arg1";
				const value = await promisify(middleCallback, {callbackArg: -2})(arg, null, arg1);
				assert.deepStrictEqual(value, [arg, arg1]);
			});

			test("should set the callback arg to -1 if negative arg is greater than length", () => {
				assert.throws(() => promisify(arg1 => arg1, {callbackArg: -2}), Error);
			});

			test("should set the callback arg to -1 by default", async () => {
				const arg = "arg";
				const arg1 = "arg1";
				const value = await promisify(agumentsCallback)(arg, arg1);
				assert.deepStrictEqual(value, [arg, arg1]);
			});

			test("should throw if invalid", () => {
				assert.throws(() => promisify(() => {}, {callbackArg: "a"}), Error);
			});
		});
	});
});
