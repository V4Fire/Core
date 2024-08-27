# core/async/timers

This module provides Async wrappers for timer functions, like, `setTimeout`, `setInterval` and `requestIdleCallback`.

```js
import Async from 'core/async';

const
  watcher = new Async();

watcher.setTimeout(() => {
  console.log('bla');
}, 100);
```
