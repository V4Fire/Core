# core/request/simple-stream-controller

This module provides a class for creating simple stream

```js
const
  streamController = new SimpleStreamController(),
  queue = ['item1', 'item2', 'item3'],
  items = [];

setTimeout(function cb() {
  // while the stream is open it's possible to add new items
  streamController.add(queue.shift());

  if (queue.length) {
    setTimeout(cb);
  } else {
    // closing the stream interrupt async loop and prevent adding new items
    streamController.close();
  }
});

// use for await...of statement to go through the stream
for await (const item of streamController) {
  items.push(item);
}

// ['item1', 'item2', 'item3']
console.log(items)
```

It's possible to iterate through already added items synchronously

```js
const
  // constructor can take iterable object with initial items
  streamController = new SimpleStreamController(['item1', 'item2', 'item3']),
  items = [];

for (const item of streamController) {
  items.push(item);
}

console.log(items) // ['item1', 'item2', 'item3']
```

It's possible to throw an error within async loop

```js
const
  streamController = new SimpleStreamController();

setTimeout(function cb() {
  // call `destroy` method to throw an error within async loop
  // provide the error object as argument
  // also it closes the stream
  streamController.destroy('stream destroyed');
});

try {
  for await (const _ of streamController) {
      console.log('unreachable code');
  }
} catch(err) {
  console.log(err); // 'stream destroyed'
}

// will be ingnored
streamController.add('item');
```
