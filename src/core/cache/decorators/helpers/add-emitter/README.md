# core/cache/decorators/helpers/add-emitter

This module provides a helper for [[Cache]] decorators to add a feature of emitting mutation events caused by side effect.

```js
import addEmitter from 'core/cache/decorators/helpers/add-emitter';
import SimpleCache from 'core/cache/simple';

const
  cache = new SimpleCache();

// `originalRemove` doesn't emit events
const {remove: originalRemove, subscribe} = addEmitter(cache);

// Now cache.eventEmitter emit event 'remove' with args [cache(instance what call emit), [...args]]
cache.remove('foo');

// (eventName, instanceOfListener, callback) - callback invoked only if emit was made by children of instanceOfListener;
subscribe('remove', cache, (key) => {
  console.log(key);
});
```
