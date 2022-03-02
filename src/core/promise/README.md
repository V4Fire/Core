# core/promise

This module provides a bunch of helpers to work with Promises and Promise-like structures.
The submodules contain different classes with promise-like structures.

## createControllablePromise

Creates a promise that can be resolved from the "outside".

```js
import SyncPromise from 'core/promise/sync';
import AbortablePromise from 'core/promise/abortable';
import { createControllablePromise } from 'core/promise';

const promise = createControllablePromise();

promise.resolve(10).then((res) => {
  console.log(res === 10);
});

const syncPromise = createControllablePromise({type: SyncPromise});

syncPromise.resolve(10).then((res) => {
  console.log(res === 10);
});

const abortablePromise = createControllablePromise({
  type: AbortablePromise,
  executor: (resolve, reject, onAbort) => {
    onAbort(() => {
      console.log('The promise has been aborted');
    });
  }
});

abortablePromise.abort();
```
