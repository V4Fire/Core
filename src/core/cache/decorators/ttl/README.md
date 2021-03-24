# core/cache/decorators/ttl

This module provides a wrapper for [[Cache]] data structure with ttl api.
TTL for property and default TTL provides in milliseconds.

## Example

```js
import SimpleCache from 'core/cache/simple';
import addTTL from 'core/decorators/cache/ttl';

const
  cache = addTTL(new SimpleCache());

cache.add('foo', 'bar1', {ttl: 500});
cache.add('foo2', 'bar2', {ttl: 1000});
cache.add('baz', 'bar3');

console.log(cache.keys().length); // 3

setTimeout(() => {
  console.log(cache.keys().length); // 1
}, 2000);
```

## Default ttl

When you wrap cache with ttl decorator you can provide default ttl.
Default ttl has a lower priority than the ttl bound to the property.

```js
import SimpleCache from 'core/cache/simple';
import addTTL from 'core/decorators/cache/ttl';

const
  cache = addTTL(new SimpleCache(), 10000);

cache.add('foo', 'bar1', {ttl: 500}); // TTL 500 have higher priority and will overwrite 10000
cache.add('foo2', 'bar2'); // TTL will be 10000
```

## Property collisions

In case of a property collision, all the old properties, including the TTL, will be overwrited.

```js
import SimpleCache from 'core/cache/simple';
import addTTL from 'core/decorators/cache/ttl';

const
  cache = addTTL(new SimpleCache());

cache.add('foo', 'bar1', {ttl: 500});
cache.add('foo', 'bar1'); // TTL will be overwrited
```
