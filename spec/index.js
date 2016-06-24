const promisificator = require("../src");

console.log("start");

function myFunc(arg, cb) {
  const {
    promise,
    callback,
  } = promisificator(cb);

  callback(null, arg);

  return promise;
}

myFunc("promise").then(console.log);

myFunc("callback", (err, result) => {
  if (err) {
    return console.error(err);
  }
  console.log(result);
});

console.log("end");
