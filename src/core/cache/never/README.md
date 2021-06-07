# core/cache/never

This module provides a loopback class for a [[Cache]] data structure.
It can be helpful if you use the "strategy" pattern and need to prevent caching.

```js
import * as cache from 'core/cache';

class Foo {
  constructor(cacheStrategy) {
    this.cache = cache[cacheStrategy];
  }
}

const withCache = new Foo('Cache');
const withoutCache = new Foo('NeverCache');
```

## API

See [[Cache]].
