# core/cache

## caches

This module provides the base interface for a [[Cache]] data structure: a simple in-memory key-value storage, which can be useful to organize cache data structures.
The submodules contain different implementations for that interface. The main module re-exports these implementations:

* `AbstractCache` — an alias for [`core/cache/interface/Cache`](interface.ts);
* `Cache` — an alias for [`core/cache/simple`](simple);
* `RestrictedCache` — an alias for [`core/cache/restricted`](restricted);
* `NeverCache` — an alias for [`core/cache/never`](never).

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

## ttl

`core/cache/ttl` provide wrapper for any cache. Takes instance of cache and return wrapped version with additional features.

```js
import SimpleCache from 'core/cache/simple';
import wrapCacheWithTTL from 'core/cache/ttl';

const
  cache = wrapCacheWithTTL(new SimpleCache());

// Diffs:
// 1) Method "add" accept third optional parameter time until destroy item in milliseconds
cache.add('foo', 'bar1', {ttl: 500});

// 2) Additional method for clear ttl from property
cache.clearTTL('foo');
```
