# core/async

This module provides a class to control asynchronous operations.

```js
import Async from 'core/async';

const
  watcher = new Async();

watcher.setTimeout(() => {
  console.log(1);
}, 100, {group: 'foo'});

watcher.setTimeout(() => {
  console.log(2);
}, 200, {group: 'foo'});

watcher.clearTimeout({group: 'foo'});
```
