# core/cache/restricted

This module provides a class for a [[Cache]] data structure with support for limiting of values in the cache.

```js
import RestrictedCache from 'core/cache/restricted';

// The constructor takes a number of maximum values in the cache
const
  cache = new RestrictedCache(4);

cache.set('foo1', 'bar1');
cache.set('foo2', 'bar2');
cache.set('foo3', 'bar3');

console.log(cache.keys().length); // 3
console.log(cache.has('foo1'));   // true

cache.set('foo4', 'bar4');

console.log(cache.keys().length); // 3
console.log(cache.has('foo1'));   // false
console.log(cache.has('foo4'));   // true

// Modify max size of cache
cache.modifySize(2);
cache.set('foo5', 'bar5');
cache.set('foo6', 'bar6');
console.log(cache.keys().length); // 5

cache.modifySize(-2);
console.log(cache.keys().length); // 3
console.log(cache.has('foo2'));   // false
console.log(cache.has('foo3'));   // false
```
