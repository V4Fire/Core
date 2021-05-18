# core/event

This module provides a bunch of helper functions to handle events in more flexibly way.

## resolveAfterEvents

The function returns a promise that will be resolved after emitting of all events from the specified emitter.

```js
import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import { resolveAfterEvents } from 'core/event';

const
  emitter = new EventEmitter();

resolveAfterEvents(emitter, 'foo', 'bar')
  .then(() => console.log('Bang!'));

emitter.emit('foo');
emitter.emit('bar');
```

## createsAsyncSemaphore

The function wraps a callback into a new function that never calls the target until all specified flags are resolved.
`createsAsyncSemaphore` returns a new function that takes a string flag and resolves it.
After all, flags are resolved, the last function invokes the target function.
If you try to invoke the function after the first time resolving, ii won't be executed.

```js
import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import { createsAsyncSemaphore } from 'core/event';

const semaphore = createsAsyncSemaphore(() => {
  console.log('Boom!');
}, 'foo', 'bar');

semaphore('foo');
semaphore('bar') // Boom!
```
