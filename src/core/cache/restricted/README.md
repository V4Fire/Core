# core/cache/restricted

This module provides a class for a [[Cache]] data structure with support for limiting of values in the cache.

```js
import RestrictedCache from 'core/cache/restricted';

// The constructor takes a number of maximum values in the cache
const
  cache = new RestrictedCache(4);

cache.add('foo', 'bar1');
cache.add('foo2', 'bar2');
cache.add('foo3', 'bar3');

console.log(cache.keys().length); // 3
console.log(cache.has('foo1'));   // true

cache.add('foo4', 'bar4');

console.log(cache.keys().length); // 3
console.log(cache.has('foo1'));   // false
console.log(cache.has('foo4'));   // true
```
