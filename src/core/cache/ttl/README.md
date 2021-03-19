# core/cache/ttl

This module provides a wrapper for [[Cache]] data structure with ttl api.

```js
import SimpleCache from 'core/cache/simple';
import wrapCacheWithTTL from 'core/cache/ttl';

const
  cache = wrapCacheWithTTL(new SimpleCache());

cache.add('foo', 'bar1', {ttl: 500});
cache.add('foo2', 'bar2', {ttl: 1000});
cache.add('baz', 'bar3');

console.log(cache.keys().length); // 3

setTimeout(() => {
  console.log(cache.keys().length); // 1
}, 2000);
```
