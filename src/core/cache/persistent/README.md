# core/cache/persistent

This module provides a wrapper for [[Cache]] data structure with persistent.

## Example

```js
import PersistentWrapper from 'core/cache/persistent';
import SimpleCache from 'core/cache/simple';
import { asyncLocal } from 'core/kv-storage';

const
  options = {
    readFromMemoryStrategy: 'always',
    initializationStrategy: 'active',
  },
  persistentCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();

await persistentCache.add('foo', 'bar');
await persistentCache.add('foo2', 'bar2');

// Will have all values from old cache
const 
  copyOfCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();
```

## Options

### Persistent TTL

Optional parameter describe default TTL in milliseconds for all storage.
Does not affect original cache at all.

```js
import PersistentWrapper from 'core/cache/persistent';
import SimpleCache from 'core/cache/simple';
import { asyncLocal } from 'core/kv-storage';

const
  options = {
    persistentTTL: 60000,
    readFromMemoryStrategy: 'always',
    initializationStrategy: 'active',
  },
  persistentCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();

// This values will be valid for next 60 seconds, after 60 seconds they will be deleted at the first request
await persistentCache.add('foo', 'bar');
await persistentCache.add('foo2', 'bar2');
```

### Initialization Strategy

Required parameter describe how properties from storage will be copied in cache.

#### active

'active' - all properties from storage will be cloned in cache during initialization.
Assumes that our storage have property `__storage__` with object format `{ key: ttl }`.

```js
import PersistentWrapper from 'core/cache/persistent';
import SimpleCache from 'core/cache/simple';
import { asyncLocal } from 'core/kv-storage';

const
  options = {
    readFromMemoryStrategy: 'always',
    initializationStrategy: 'active',
  },
  persistentCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();

await persistentCache.add('foo', 'bar');
await persistentCache.add('foo2', 'bar2');

// All properties already in our Simple cache
const 
  copyOfCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();
```

#### semi-lazy

'semi-lazy' - properties from storage will be cloned during first request of property.
Assumes that our storage have property `__storage__` with object format `{ key: ttl }`.

```js
import PersistentWrapper from 'core/cache/persistent';
import SimpleCache from 'core/cache/simple';
import { asyncLocal } from 'core/kv-storage';

const
  options = {
    readFromMemoryStrategy: 'always',
    initializationStrategy: 'semi-lazy',
  },
  persistentCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();

await persistentCache.add('foo', 'bar');
await persistentCache.add('foo2', 'bar2');

// At this moment simple cache dont have our properties
const 
  copyOfCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();

// foo will check ttl in storage.__storage__[key] and copied from storage to our cache
await copyOfCache.get('foo');
```

#### lazy

'lazy' - properties from storage will be cloned during first request of property.
Assumes that our storage have additional property for each property with key `${key}__ttl`.

```js
import PersistentWrapper from 'core/cache/persistent';
import SimpleCache from 'core/cache/simple';
import { asyncLocal } from 'core/kv-storage';

const
  options = {
    readFromMemoryStrategy: 'always',
    initializationStrategy: 'lazy',
  },
  persistentCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();

await persistentCache.add('foo', 'bar');
await persistentCache.add('foo2', 'bar2');

// At this moment simple cache dont have our properties
const 
  copyOfCache = await new PersistentWrapper(new SimpleCache(), asyncLocal, options).getInstance();

// foo will check ttl in storage[${key}_ttl] and copied from storage to our cache
await copyOfCache.get('foo');
```

### Read From Memory Strategy

Required parameter describe when properties will be get from storage.

#### always

Any request of property will try to get copy from storage.

#### connection loss

Requests to storage will be only if client offline.