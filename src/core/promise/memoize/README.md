# core/promise/memoize

This module provides a bunch of helpers to memoize promises.

```js
import { memoize } from 'core/promise/memoize';

// Will fire:
// 2
// 1
// 3
// 4
memoize('core/url/concat', () => import('core/url/concat')).then(() => {
  console.log(1);

  memoize('core/url/concat', () => import('core/url/concat')).then(() => {
    console.log(3);
  });

  console.log(4);
});

console.log(2);
```
