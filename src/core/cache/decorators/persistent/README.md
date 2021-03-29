# core/cache/decorators/persistent

This module provides a wrapper for [[Cache]] data structures to add a feature of persistent data storing.
To describe how long should keep an item in the persistent cache, use the `persistentTTL` parameter.
The value for `persistentTTL` should be provided in milliseconds.

## Example

```js
import { asyncLocal } from 'core/kv-storage';

import SimpleCache from 'core/cache/simple';
import addPersistent from 'core/cache/persistent';

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

## Options

### persistentTTL

The option specifies the default TTL to keep items within the persistent storage in milliseconds.
This value is used when you don't provide the `persistentTTL` parameter when saving an item.

```js
import { asyncLocal } from 'core/kv-storage';

import SimpleCache from 'core/cache/simple';
import addPersistent from 'core/cache/persistent';

const options = {
  persistentTTL: (60).seconds(),
  initializationStrategy: 'active',
};

const
  persistentCache = await addPersistent(new SimpleCache(), asyncLocal, options);

// If we "reload" the cache from the storage by using the browser reloading or another way,
// these saved values can be "restored" from the storage only for the next 60 seconds
await persistentCache.set('foo', 'bar');
await persistentCache.set('foo2', 'bar2');
```

### Load From Storage

There is more than one way to initialize a cache from persistent storage.
The most obvious way to do it is to load all data from the storage to RAM during the cache's initialization.
This strategy is simple but not effective cause if we can have a huge amount of data in the storage,
so we have to load it all at the same time. This can be very expensive. We need another way.
But what if we load an item from the cache only when it is requested the first time.
In that case, we haven't to load the whole stored data on cache initialization,
but all cache methods will change API - they will become return promises instead of the raw results.
Some consumers cannot be ready for changing API, so there is no silver bullet. We have to keep both strategies.

#### onInit

'onInit' - all properties from storage will be cloned in cache during initialization.
Assumes that our storage has property `__storage__` with object format `{ key: ttl }`.

```js
import addPersistent from 'core/cache/persistent';
import SimpleCache from 'core/cache/simple';
import { asyncLocal } from 'core/kv-storage';

const options = {
  loadFromStorage: 'onInit',
};

const
  persistentCache = await addPersistent(new SimpleCache(), asyncLocal, options);

await persistentCache.set('foo', 'bar');
await persistentCache.set('foo2', 'bar2');

// All properties already in our Simple cache
const
  copyOfCache = await addPersistent(new SimpleCache(), asyncLocal, options);
```

#### onDemand

'onDemand' - properties from storage will be cloned during the first request of property.
Assumes that our storage has additional property for each property with key `${key}__ttl`.

```js
import addPersistent from 'core/cache/persistent';
import SimpleCache from 'core/cache/simple';
import { asyncLocal } from 'core/kv-storage';

const options = {
  loadFromStorage: 'onDemand',
};

const
  persistentCache = await addPersistent(new SimpleCache(), asyncLocal, options);

await persistentCache.set('foo', 'bar');
await persistentCache.set('foo2', 'bar2');

// At this moment simple cache don't have our properties
const
  copyOfCache = await addPersistent(new SimpleCache(), asyncLocal, options);

// The cache will check ttl in storage[${key}_ttl] and copied from storage to our cache
await copyOfCache.get('foo');
```

#### onOfflineDemand

'onOfflineDemand' - properties from storage will be cloned during the first request of property if internet connection is lost.
Assumes that our storage has additional property for each property with key `${key}__ttl`.

```js
import addPersistent from 'core/cache/persistent';
import SimpleCache from 'core/cache/simple';
import { asyncLocal } from 'core/kv-storage';

const options = {
  loadFromStorage: 'onDemand',
};

const
  persistentCache = await addPersistent(new SimpleCache(), asyncLocal, options);

await persistentCache.set('foo', 'bar');
await persistentCache.set('foo2', 'bar2');

// At this moment simple cache don't have our properties
const
  copyOfCache = await addPersistent(new SimpleCache(), asyncLocal, options);

/*
 * If internet connection is lost The cache will check ttl in storage[${key}_ttl] and copied from storage to our cache
 * Else will work as common cache
 */
await copyOfCache.get('foo');
```