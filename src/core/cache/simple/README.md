# core/cache/simple

This module provides a class for a simple in-memory [[Cache]] data structure.

```js
import SimpleCache from 'core/cache/simple';

const
  cache = new SimpleCache();

cache.add('foo', 'bar1');
cache.add('foo2', 'bar2');
cache.add('baz', 'bar3');

console.log(cache.keys().length); // 3

cache.clear((val, key) => /foo/.test(key));

console.log(cache.keys().length); // 1
```
