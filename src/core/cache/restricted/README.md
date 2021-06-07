# core/cache/restricted

This module provides a class for a [[Cache]] data structure with support for limiting of values in the cache.
The structure' constructor takes how many values can be stored in the cache (by default, it equals `20`).

```js
import RestrictedCache from 'core/cache/restricted';

const
  cache = new RestrictedCache(3);

cache.set('foo1', 'bar1');
cache.set('foo2', 'bar2');
cache.set('foo3', 'bar3');

console.log(cache.size); // 3
console.log(cache.has('foo1')); // true

cache.set('foo4', 'bar4');

console.log(cache.size); // 3
console.log(cache.has('foo1')); // false
console.log(cache.has('foo4')); // true

// Modify the cache' capacity
cache.setCapacity(5);

cache.set('foo5', 'bar5');
cache.set('foo6', 'bar6');

console.log(cache.size); // 5

cache.setCapacity(3);

console.log(cache.size); // 3
console.log(cache.has('foo2')); // false
console.log(cache.has('foo3')); // false
```

## API

See [[Cache]].

### setCapacity

Sets a new capacity of the cache.
The method returns a map of truncated elements that the cache can't fit anymore.

```js
import RestrictedCache from 'core/cache/restricted';

// The constructor takes a number of maximum values in the cache

const
  cache = new RestrictedCache(3);

cache.set('foo1', 'bar1');
cache.set('foo2', 'bar2');
cache.set('foo3', 'bar3');

// Map([['foo1', 'bar1], ['foo2', 'bar2']])
console.log(cache.setCapacity(1));

console.log(cache.size); // 1
```
