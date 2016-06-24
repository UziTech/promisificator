"use strict";

const promisificator = require("../src/index.js");

const {
    promise,
    callback,
} = promisificator();

promise
	.then(console.log)
	.catch(console.error);

callback(null, "test");
