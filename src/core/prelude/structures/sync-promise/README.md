# core/prelude/structures/sync-promise

This module provides a class is similar to the native promise class but works synchronously.

```js
import SyncPromise from 'core/prelude/structures/sync-promise';

// 1
// 2
SyncPromise.resolve().then(() => console.log(1));
console.log(2);
```

## Non-standard API

### isPending

True if the current promise is pending.

```js
import SyncPromise from 'core/prelude/structures/sync-promise';

const sleep = new SyncPromise((r) => setTimeout(r, 100));
console.log(sleep.isPending === true);

setTimeout(() => {
  console.log(sleep.isPending === false);
}, 200);
```

### unwrap

Returns the promise' value if it is fulfilled, otherwise throws an exception.

```js
import SyncPromise from 'core/prelude/structures/sync-promise';

const sleep = new SyncPromise((r) => setTimeout(() => r(10), 100));

try {
  sleep.unwrap();

} catch (err) {
  console.error(err);
}

setTimeout(() => {
  console.log(sleep.unwrap() === 10);
}, 200);
```
