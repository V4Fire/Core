# core/queue/order

This module provides a class to organize an ordered [[Queue]] data structure.
See [`core/queue`](src_core_queue.html) for more information.

## Comparator

To compare different elements from the queue, a special comparator function is used, which has the same API as
the native comparator `Array.prototype.sort`. To provide a comparator, use the structure constructor.

## Usage

```js
import OrderedQueue from 'core/queue/order';

const
  queue = new OrderedQueue<number>((a, b) => a - b);

queue.push(1);
queue.push(5);
queue.push(2);
queue.push(-1);
queue.push(5);
queue.push(2);
queue.push(-1);
queue.push(5);

console.log(queue.length); // 8

console.log(queue.head);   // 5
console.log(queue.pop());  // 5

console.log(queue.head);   // 5
console.log(queue.pop());  // 5

console.log(queue.pop());  // 5
console.log(queue.pop());  // 2
console.log(queue.pop());  // 2

queue.clear();
console.log(queue.length); // 0
```
