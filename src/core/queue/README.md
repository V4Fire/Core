# core/queue

This module provides a base interface for the [[Queue]] data structure. The submodules contains different classes and interfaces that extends or implements this interface.

```js
import { AbstractQueue } from 'core/queue';

export default class Queue extends AbstractQueue {
  internalQueue = [];

  get head() {
    return this.internalQueue[0];
  }

  get length() {
    return this.internalQueue.length;
  }

  push(el) {
    return this.internalQueue.push(el);
  }

  shift() {
    return this.internalQueue.shift();
  }

  clear() {
    this.internalQueue = [];
  }
}
```

## Extensions:

* [WorkerQueue](src_core_queue_worker_index.html) — an abstract class that adds support of execution workers to the queue interface.

## Implementations:

* [MergeWorkerQueue](src_core_queue_worker_merge_index.html) — an class that implements a [[WorkerQueue]] data structure.
