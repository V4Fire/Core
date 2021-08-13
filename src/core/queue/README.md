# core/queue

This module provides an abstract class for a [[Queue]] data structure.
The submodules contain different classes and interfaces that extends or implements that class.

The main module re-exports these implementations:

* `AbstractQueue` — an alias for [`core/queue/interface/Queue`](src_core_queue_interface.html);
* `AbstractWorkerQueue` — an alias for [`core/queue/worker/interface/WorkerQueue`](src_core_queue_worker_interface.html);
* `Queue` — an alias for [`core/queue/simple`](src_core_queue_simple.html);
* `OrderedQueue` — an alias for [`core/queue/order`](src_core_queue_order.html);
* `MergeQueue` — an alias for [`core/queue/merge`](src_core_queue_merge.html).
* `AbstractWorkerQueue` — an alias for [`core/queue/worker`](src_core_queue_worker.html).
* `WorkerQueue` — an alias for [`core/queue/worker/simple`](src_core_queue_worker_simple.html).
* `MergeWorkerQueue` — an alias for [`core/queue/worker/merge`](src_core_queue_worker_merge.html).

## API

The base API is pretty close to a JS array: `push/unshift`, `pop/shift`, `length`.
Notice, the `shift` and `unshift` methods just aliases for `pop` and `push`.
In addition, the API declares `head` to get the first element from a queue and `clear` to clear the whole queue.

## Simple implementation

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

  // An alias for `push`.
  // The method has the default implementation.
  unshift(el) {
    return this.push(el);
  }

  pop() {
    return this.internalQueue.shift();
  }

  // An alias for `pop`.
  // The method has the default implementation.
  shift() {
    return this.pop();
  }

  clear() {
    this.internalQueue = [];
  }
}
```
