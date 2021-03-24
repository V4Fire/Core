# core/cache

This module provides the base interface for a [[Cache]] data structure: a simple in-memory key-value storage,
which can be useful to organize cache data structures.
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

## Decorators

Also, the module provides a bunch of functions to decorate cache storage, like adding the `ttl` feature or persisting storing.

### core/cache/ttl

Provides a decorator for any cache to add the feature of cache expiring.

```js
import SimpleCache from 'core/cache/simple';
import wrapCacheWithTTL from 'core/cache/ttl';

const
  cache = wrapCacheWithTTL(new SimpleCache());

// Method "add" accepts as the third optional parameter time until expiring the item to store in milliseconds.
cache.add('foo', 'bar1', {ttl: 500});

// Additional method to clear the `ttl` descriptor from a cache iteb by the specified key
cache.clearTTL('foo');
```
