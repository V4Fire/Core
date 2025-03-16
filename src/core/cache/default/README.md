# core/cache/default

This module provides a class for a [[Cache]] data structure with support for adding default value via the passed factory
when a non-existent key is accessed.

```js
import DefaultCache from 'core/cache/default';

const
  cache = new DefaultCache(Array);

cache.get('key')

console.log(cache.keys().length); // 1
console.log(Object.isArray(cache.get('key'))); // true

```

## API

See [[Cache]].
