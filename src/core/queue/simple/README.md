# core/queue/simple

This module provides a class to organize a simple queue data structure.

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

console.log(a.pop()); // 1
console.log(a.pop()); // 5
console.log(a.pop()); // 2
console.log(a.pop()); // -1
console.log(a.pop()); // 5
console.log(a.pop()); // 2
console.log(a.pop()); // -1
console.log(a.pop()); // 5
```
