# core/async/proxy

This module provides common proxy wrappers for the Async API, like, `proxy`, `worker` and `promise`.

```js
import Async from 'core/async';

const
  watcher = new Async(),
  img = new Image();

img.onload = watcher.proxy(() => {
  console.log('done');
});

img.src = 'bla.jpg';
```
