# core/event

This module provides a bunch of helper functions to observe events in more flexibly way.

```js
/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import { resolveAfterEvents, createsAsyncSemaphore } from 'core/event';

const
  emitter = new EventEmitter();

resolveAfterEvents(emitter, 'foo', 'bar').then(() => console.log('Bang!'));
emitter.emit('foo');
emitter.emit('bar');

const semaphore = createsAsyncSemaphore(() => {
  console.log('Boom!');
}, 'foo', 'bar');

semaphore('foo');
semaphore('bar') // Boom!
```
