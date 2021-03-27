# core/cache/decorators/persistent

This module provides a wrapper for [[Cache]] data structures to add the feature of persistent.

## Example

```js
import PersistentWrapper from 'core/cache/persistent';
import SimpleCache from 'core/cache/simple';
import { asyncLocal } from 'core/kv-storage';

const options = {
  readFromMemoryStrategy: 'always',
  initializationStrategy: 'active',
};

const
  persistentCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();

await persistentCache.set('foo', 'bar');
await persistentCache.set('foo2', 'bar2');

// Will have all values from the old cache
const 
  copyOfCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();
```

## Options

### Persistent TTL

The optional parameter describes default TTL in milliseconds for all storage.
The default value is used when you don't provide the `ttl` property when saving an item.
Does not affect the original cache at all.

```js
import PersistentWrapper from 'core/cache/persistent';
import SimpleCache from 'core/cache/simple';
import { asyncLocal } from 'core/kv-storage';

const options = {
  persistentTTL: 60000,
  readFromMemoryStrategy: 'always',
  initializationStrategy: 'active',
};

const
  persistentCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();

// These values will be valid for the next 60 seconds, after 60 seconds they will be deleted at the first request
await persistentCache.set('foo', 'bar');
await persistentCache.set('foo2', 'bar2');
```

### Initialization Strategy

The required parameter describes how properties from storage will be copied in the cache.
Warning! method keys will work correct only with `active` initialization strategy.

#### active

'active' - all properties from storage will be cloned in cache during initialization.
Assumes that our storage has property `__storage__` with object format `{ key: ttl }`.

```js
import PersistentWrapper from 'core/cache/persistent';
import SimpleCache from 'core/cache/simple';
import { asyncLocal } from 'core/kv-storage';

const options = {
  readFromMemoryStrategy: 'always',
  initializationStrategy: 'active',
};
  
const
  persistentCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();

await persistentCache.set('foo', 'bar');
await persistentCache.set('foo2', 'bar2');

// All properties already in our Simple cache
const 
  copyOfCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();
```

#### semi-lazy

'semi-lazy' - properties from storage will be cloned during the first request of property.
Assumes that our storage has property `__storage__` with object format `{ key: ttl }`.

```js
import PersistentWrapper from 'core/cache/persistent';
import SimpleCache from 'core/cache/simple';
import { asyncLocal } from 'core/kv-storage';

const options = {
  readFromMemoryStrategy: 'always',
  initializationStrategy: 'semi-lazy',
};

const
  persistentCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();

await persistentCache.set('foo', 'bar');
await persistentCache.set('foo2', 'bar2');

// At this moment simple cache don't have our properties
const 
  copyOfCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();

// The cache will check ttl in storage.__storage__[key] and copied from storage to our cache
await copyOfCache.get('foo');
```

#### lazy

'lazy' - properties from storage will be cloned during the first request of property.
Assumes that our storage has additional property for each property with key `${key}__ttl`.

```js
import PersistentWrapper from 'core/cache/persistent';
import SimpleCache from 'core/cache/simple';
import { asyncLocal } from 'core/kv-storage';

const options = {
  readFromMemoryStrategy: 'always',
  initializationStrategy: 'lazy',
};

const
  persistentCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();;

await persistentCache.set('foo', 'bar');
await persistentCache.set('foo2', 'bar2');

// At this moment simple cache don't have our properties
const 
  copyOfCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();

// The cache will check ttl in storage[${key}_ttl] and copied from storage to our cache
await copyOfCache.get('foo');
```

### Read From Memory Strategy

The required parameter describes when properties will get from storage.

#### always

Any request of the property will try to get a copy from storage.

#### connection loss

Storage requests will be only if the client offline.