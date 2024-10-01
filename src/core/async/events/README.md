# core/async/events

This module provides Async wrappers for event emitters.

```js
import Async from 'core/async';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

const
  emitter = new EventEmitter(),
  watcher = new Async();

watcher.on(emitter, 'foo', (e) => {
  console.log(e);
});

emitter.emit('foo', 'bar');
```
