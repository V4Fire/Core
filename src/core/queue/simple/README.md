# core/queue/simple

This module provides a class to organize a simple [[Queue]] data structure.

## Usage

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

queue.clear();
console.log(queue.length); // 0
```
