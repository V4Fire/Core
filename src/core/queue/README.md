# core/queue

This module provides an abstract class for any [[Queue]] data structure.
For convenience, the underlying queue API is fairly close to the regular JS array API.

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

### Own API

#### head

The first element in the queue.

```js
import Queue from 'core/queue/simple';

const
 queue = new Queue();

queue.push(1);
queue.push(5);

console.log(queue.head); // 1
```

#### clone

Creates a new queue based on the current one and returns it.

```js
import Queue from 'core/queue/simple';

const
 queue1 = new Queue();

queue1.push(1);
queue1.push(5);

const
  queue2 = queue1.clone();

console.log(queue2.head);       // 1
console.log(queue1 !== queue2); // true
```

#### clear

Clears the queue.

```js
import Queue from 'core/queue/simple';

const
  queue = new Queue();

queue.push(1);
queue.push(5);

console.log(queue.head); // 1

queue.clear();

console.log(queue.head);   // undefined
console.log(queue.length); // 0
```

### Array-Like API

For convenience, the underlying queue API is fairly close to the regular JS array API.

1. That is, you have methods for adding and removing elements: `push/unshift` and `pop/shift`.
   Notice, the `shift` and `unshift` methods just aliases for `pop` and `push`.

   ```js
   import Queue from 'core/queue/simple';

   const
     queue = new Queue();

   queue.push(1);
   queue.unshift(5);

   console.log(queue.pop());   // 1
   console.log(queue.shift()); // 5
   ```

2. You can also find out the number of elements in the queue using the `length` getter.

   ```js
   import Queue from 'core/queue/simple';

   const
     queue = new Queue();

   queue.push(1);
   queue.push(5);

   console.log(queue.length);  // 2
   ```

3. Like arrays, any queue can be traversed using an iterator.

   ```js
   import Queue from 'core/queue/simple';

   const
     queue = new Queue();

   queue.push(1);
   queue.push(5);

   // [1, 5]
   console.log([...queue]);

   // [1, 5]
   console.log([...queue.values()]);
   ```

In addition, the API declares `head` to get the first element from the queue and `clear` to clear the queue.

```js
import Queue from 'core/queue/simple';

const
 queue = new Queue();

queue.push(1);
queue.push(5);

console.log(queue.head); // 1

queue.clear();

console.log(queue.head);   // undefined
console.log(queue.length); // 0
```

### Simple implementation

```js
import { AbstractQueue } from 'core/queue';

export default class Queue extends AbstractQueue {
  #internalQueue = [];

  get head() {
    return this.#internalQueue[0];
  }

  get length() {
    return this.#internalQueue.length;
  }

  push(el) {
    return this.#internalQueue.push(el);
  }

  pop() {
    return this.#internalQueue.shift();
  }

  clone() {
    const queue = new Queue();
    queue.internalQueue = this.#internalQueue.slice();
    return queue;
  }

  clear() {
    this.#internalQueue = [];
  }
}
```
