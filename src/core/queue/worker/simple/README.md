# core/queue/worker/simple

This module provides a class to organize a [[WorkerQueue]] data structure.
See [`core/queue/worker`](src_core_queue_worker.html) and [`core/queue`](src_core_queue.html) for more information.

```js
import WorkerQueue from 'core/queue/worker/simple';

const queue = new WorkerQueue((task) => {
  console.log(task);
}, {concurrency: 2});

queue.push({a: 1});

console.log(queue.length); // 0

queue.push({a: 2});

console.log(queue.length); // 0

queue.push({a: 3});

console.log(queue.length); // 1

queue.push({a: 4});

console.log(queue.length); // 2

queue.clear();
console.log(queue.length); // 0
```
