# core/queue/merge

This module provides a class to organize a [[Queue]] data structure with support of task merging by a specified hash function.
It means that the same tasks aren't duplicated. See [`core/queue`](src_core_queue.html) for more information.

## Providing a hash function

To provide a function to calculate task hashes, use the structure constructor.
By default, all hashes are calculated via `Object.fastHash`.

## Usage

```js
import MergeQueue from 'core/queue/merge';

const queue = new MergeQueue((task) => JSON.stringify(task));

queue.push({a: 1});
queue.push({a: 1});

console.log(queue.length); // 1

queue.push({a: 2});

console.log(queue.head);   // {a: 1}
console.log(queue.length); // 2

queue.clear();
console.log(queue.length); // 0
```
