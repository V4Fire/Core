# core/cache/decorators/ttl

This module provides a wrapper for [[Cache]] data structures to add the feature of cache expiring.
A value for `ttl` properties provides in milliseconds.

## Example

```js
import SimpleCache from 'core/cache/simple';
import addTTL from 'core/cache/decorators/ttl';

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

When you wrap a cache object with the `ttl` decorator you can provide the default ttl value.
The default value is used when you don't provide the `ttl` property when saving an item.

```js
import SimpleCache from 'core/cache/simple';
import addTTL from 'core/cache/decorators/ttl';

const
  cache = addTTL(new SimpleCache(), 10000);

cache.add('foo', 'bar1', {ttl: 500}); // TTL 500 has the higher priority and will overwrite 10000s
cache.add('foo2', 'bar2'); // TTL will be 10000
```

## Property collisions

In case of a property collision, all old properties, including their TTL values, will be overwritten.

```js
import SimpleCache from 'core/cache/simple';
import addTTL from 'core/cache/decorators/ttl';

const
  cache = addTTL(new SimpleCache());

cache.add('foo', 'bar1', {ttl: 500});
cache.add('foo', 'bar1'); // TTL will be overwritten
```
