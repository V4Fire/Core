# core/promise/sync

This module provides a class is similar to the native promise class but works synchronously.

```js
import SyncPromise from 'core/promise/sync';

// 1
// 2
SyncPromise.resolve().then(() => console.log(1));
console.log(2);
```

## Helpers

The module provides a bunch of helpers to memoize promises.

### Memoize

Memorizes the specified promise and converts it to a synchronous promise.
It means that after the first resolution, the promised result will be cached,
and the method returns the synchronous version of a promise.

```js
import { memoize } from 'core/promise/memoize';

// Will fire:
// 2
// 1
// 3
// 4
memoize('core/url/concat', () => import('core/url/concat')).then(() => {
  console.log(1);

  memoize('core/url/concat', () => import('core/url/concat')).then(() => {
    console.log(3);
  });

  console.log(4);
});

console.log(2);
```
