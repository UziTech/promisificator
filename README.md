# promisificator

Returns a `promise` and a `callback` that will fullfill the `promise`.

## Examples

#### 1. Get the result of a callback at a later time

```javascript
const promisificator = require("promisificator");

const {
  promise,
  callback,
} = promisificator();

callback(null, "test");

promise.then(console.log); // console.log("test");
```

#### 2. Allow a function to accept a callback or return a promise

```javascript
const promisificator = require("promisificator");

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

myFunc((err, result) => {
  if (err) {
    return console.error(err);
  }
  console.log(result);
}); // console.log("test");

myFunc().then(console.log, console.error); // console.log("test");
```
