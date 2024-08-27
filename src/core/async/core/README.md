# core/async/core

This module provides the base class for the Async module.

```js
import Async from 'core/async';

const
  watcher = new Async();

// ...

watcher.muteAll();

// ...

watcher.unmuteAll();
watcher.suspendAll();

// ..

watcher.unsuspendAll();
watcher.clearAll();
```
