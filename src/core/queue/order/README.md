# core/queue/order

This module provides a class to organize an ordered [[Queue]] data structure.

## comparator

To compare different elements from a queue is used the special comparator function that has the same API with
the native `Array.prototype.sort` comparator. To provide a comparator, use the structure' constructor.

## usage

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

console.log(a.pop()); // 5
console.log(a.pop()); // 5
console.log(a.pop()); // 5
console.log(a.pop()); // 2
console.log(a.pop()); // 2
console.log(a.pop()); // 1
console.log(a.pop()); // -1
```
