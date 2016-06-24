# promisificator

Returns a `promise` and a `callback` that will fulfill the `promise`.

## Examples

#### 1. Use the callback in an async function to resolve the promise

```javascript
const fs = require("fs");
const promisificator = require("promisificator");

const {
  promise,
  callback,
} = promisificator();

//`callback` can be passed to any async function that takes a callback
fs.readFile("/etc/password", callback);

//`promise` will be fulfilled once the callback is called
promise.then((data) => {
  console.log(data);
}, (err) => {
  throw err;
});
```

#### 2. Allow a function to accept a callback or return a promise

```javascript
const promisificator = require("promisificator");

function myFunc(arg, cb) {
  const {
    promise,
    callback,
  } = promisificator(cb);

  // `cb` will be wrapped in `process.nextTick` so it won't be
  // called immediately if it is a callback
  callback(null, arg);

  // if `cb` is a function `promise` will be undefined
  return promise;
}

myFunc("promise").then(console.log);

myFunc("callback", (err, result) => {
  if (err) {
    return console.error(err);
  }
  console.log(result);
});
```
