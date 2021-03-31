# core/cache

This module provides the base interface for a [[Cache]] data structure: a simple in-memory key-value storage,
which can be useful to organize cache data structures.
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

## Decorators

Also, the module provides a bunch of functions to decorate cache storages, like adding the `ttl` feature or persisting data storing.

### core/cache/decorators/ttl

Provides a decorator for any cache to add a feature of the cache expiring.

```js
import addTTL from 'core/cache/decorators/ttl';
import SimpleCache from 'core/cache/simple';

// The function `addTTL` accepts a cache object and a value for the default TTL as the second argument
const
  cache = addTTL(new SimpleCache(), 1000);

// The method "add" accepts as the third optional parameter time until expiring the item to store in milliseconds
cache.add('foo', 'bar1', {ttl: 500});

// Additional method to remove the `ttl` descriptor from a cache item by the specified key
cache.removeTTLFrom('foo');
```

### core/cache/decorators/persistent

Provides a decorator for any cache to add a feature of synchronous cloning of data to external storage and the ability to restore state from it.

```js
import { asyncLocal } from 'core/kv-storage';

import SimpleCache from 'core/cache/simple';
import addPersistent from 'core/cache/decorators/persistent';

// You can read about the options in the readme `core/cache/decorators/persistent/README.md`
const opts = {
  initializationStrategy: 'active',
};

const
  persistentCache = await addPersistent(new SimpleCache(), asyncLocal, opts);

await persistentCache.set('foo', 'bar');
await persistentCache.set('foo2', 'bar2');

// Cause we use the same instance for local data storing,
// this cache will have all values from the previous (it will be loaded from the storage during initialization)

const
  copyOfCache = await addPersistent(new SimpleCache(), asyncLocal, opts);
```