# core/cache

This module provides a base interface for a [[Cache]] data structure: a simple in-memory key-value storage, which can be useful to organize cache data structures.
The submodules contain different implementations for that interface. The main module re-exports these implementations:

* `AbstractCache` — an alias for [`core/cache/interface/Cache`](src_core_cache_interface.html);
* `Cache` — an alias for [`core/cache/simple`](src_core_cache_simple_index.html);
* `RestrictedCache` — an alias for [`core/cache/restricted`](src_core_cache_restricted_index.html);
* `NeverCache` — an alias for [`core/cache/never`](src_core_cache_never_index.html).

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
