# core/queue/order

This module provides a class to organize an ordered queue data structure.

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
