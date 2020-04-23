# core/prelude/structures/sync-promise

This module provides a class is similar to the native promise class but works synchronously.

```js
import SyncPromise from 'core/prelude/structures/sync-promise';

// 1
// 2
SyncPromise.resolve().then(() => console.log(1));
console.log(2);
```
