# core/promise/abortable

This module provides a class wraps promise-like objects and adds to them some extra functionality, such as possibility of cancellation, etc.

```js
import AbortablePromise from 'core/promise/abortable';

const promise = new AbortablePromise((resolve, reject, onAbort) => {
  setTimeout(resolve, 100);

  onAbort((reason) => {
    console.error(`The promise was aborted by a reason of ${reason}`);
  });

}).catch((err) => console.error(err)); // timeout

// Invoking of `abort` rejects the promise.
// Additionally, you can specify a reason to abort.
promise.abort('timeout');
```

## Tied promises

You can tie one promise with another. Tying is mean that when your abort one promise, another one will be aborted too.
To tie a promise, provide a parent promise as the second argument of the constructor or static methods, like `all` or `race`.

```js
import AbortablePromise from 'core/promise/abortable';

// catch: timeout
const parent = new AbortablePromise((resolve) => setTimeout(resolve, 100)).catch((err) => console.error(err));

// catch: timeout
const childPromise = new AbortablePromise((resolve) => setTimeout(resolve, 200)).catch((err) => console.error(err), parent);

parent.abort('timeout');
```

## API

The module re-use native Promise API with adding some extra getters, etc., you free to use such methods like `then`, `catch`, or `finally`.

### isPending

True if the current promise is pending.

```js
import AbortablePromise from 'core/promise/abortable';

const promise = new AbortablePromise((resolve) => {
  setTimeout(() => {
    resolve();

    // false
    console.log(promise.isPending);
  }, 100);
});

// true
console.log(promise.isPending);
```

## Helpers

The module provides a bunch of static helper methods and getters.

### never

The promise that is never resolved. It can be useful to create some loopback.

```js
import AbortablePromise from 'core/promise/abortable';

// This promise will never be resolved
AbortablePromise.never.then((res) => {
  console.log(res);
});
```

### resolveAndCall

The method creates a new resolved promise for the specified value.
If the resolved value is a function, it will be invoked.
The result of the invoking will be provided as a value of the promise.

```js
import AbortablePromise from 'core/promise/abortable';

AbortablePromise.resolveAndCall(Promise.resolve(() => 1)).then((res) => {
  // 1
  console.log(res);
});
```
