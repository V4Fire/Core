# core/request/modules/stream-buffer

This module provides a class to create an iterable stream structure with a feature of buffering input values,
i.e. every added value is placed within an internal buffer till they are read.

```js
const
  streamBuffer = new StreamBuffer(),
  source = ['value1', 'value2', 'value3'];

setTimeout(function cb() {
  // While the stream is open it's possible to add new values
  streamBuffer.add(source.shift());

  if (source.length > 0) {
    setTimeout(cb, 15);

  } else {
    // Closing a stream interrupt the async loop and prevent adding new items
    streamBuffer.close();
  }
}, 15);

// Use for await...of statement to go through the stream
for await (const val of streamBuffer) {
  // value1, value2, value3
  console.log(val);
}
```

It's possible to iterate through already added items synchronously.

```js
// The stream constructor can take an iterable object with initial values
const streamBuffer = new StreamBuffer(['value1', 'value2', 'value3']);

for (const item of streamBuffer) {
  // value1, value2, value3
  console.log(item);
}
```

To destroy a stream and stop all iterators, use the `destroy` method.

```js
const
  streamBuffer = new StreamBuffer();

setTimeout(function cb() {
  // Also, you can pass a reason to destroy
  streamBuffer.destroy('The stream has been destroyed');
});

try {
  for await (const _ of streamBuffer) {
    console.log('Unreachable code');
  }

} catch (err) {
  // The stream has been destroyed
  console.log(err);
}

// The stream is destroyed, and this value is never added
streamBuffer.add('item');
```
