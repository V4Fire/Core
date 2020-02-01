# core/promise/sync

This module provides a class that is similar with the native promise class, but works synchronously.

```js
import SyncPromise from 'core/promise/sync';

// 1
// 2
SyncPromise.resolve().then(() => console.log(1));
console.log(2);
```
