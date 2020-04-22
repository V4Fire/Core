# core/queue

This module provides an abstract class for a [[Queue]] data structure. The submodules contains different classes and interfaces that extends or implements this class.

The main module re-exports these implementations:

* `AbstractQueue` — an alias for [`core/queue/interface/Queue`](src_core_queue_interface.html);
* `AbstractWorkerQueue` — an alias for [`core/queue/worker/interface/WorkerQueue`](src_core_queue_worker_interface.html);
* `Queue` — an alias for [`core/queue/simple`](src_core_queue_simple_index.html);
* `OrderedQueue` — an alias for [`core/queue/order`](src_core_queue_order_index.html);
* `MergeWorkerQueue` — an alias for [`core/queue/worker/merge`](src_core_queue_worker_merge_index.html).

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

  pop() {
    return this.internalQueue.shift();
  }

  clear() {
    this.internalQueue = [];
  }
}
```
