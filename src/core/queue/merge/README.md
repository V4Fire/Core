# core/queue/merge

This module provides a class to organize a queue data structure with support of task merging by the specified hash function.
It means that the same tasks aren't duplicated.

```js
import MergeQueue from 'core/queue/merge';

const queue = new MergeQueue((task) => JSON.stringify(task));

queue.push({a: 1});
queue.push({a: 1});

console.log(queue.length); // 1

queue.push({a: 2});

console.log(queue.length); // 2
```
