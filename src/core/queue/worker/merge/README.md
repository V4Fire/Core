# core/queue/worker/merge

This module provides a class to organize a worker queue data structure with support of task merging by the specified hash function. It's means that the same tasks isn't duplicated.

```js
import MergeQueue from 'core/queue/worker/merge';

const queue = new MergeQueue((task) => {
  console.log(task);
}, {
  concurrency: 3,
  refreshInterval: 50,
  hashFn: (task) => JSON.stringify(task)
});

queue.push({a: 1});
queue.push({a: 1});
queue.push({a: 2});
queue.push({a: 3});
queue.push({a: 4});
```
