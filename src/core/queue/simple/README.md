# core/queue/simple

This module provides a class to organize a simple [[Queue]] data structure.
See [`core/queue`](src_core_queue.html) for more information.

```js
import Queue from 'core/queue/simple';

const
  queue = new Queue();

queue.push(1);
queue.push(5);
queue.push(2);
queue.push(-1);
queue.push(5);
queue.push(2);
queue.push(-1);
queue.push(5);

console.log(queue.length); // 8

console.log(queue.head);   // 1
console.log(queue.pop());  // 1

console.log(queue.head);   // 5
console.log(queue.pop());  // 5

console.log(queue.pop());  // 2
console.log(queue.pop());  // -1
console.log(queue.pop());  // 5

console.log([...queue]);   // [2, -1, 5]

const
  clonedQueue = queue.clone();

queue.clear();

console.log(queue.length);       // 0
console.log(clonedQueue.length); // 3
```
