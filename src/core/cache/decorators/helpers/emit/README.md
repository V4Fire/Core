# core/cache/decorators/helpers/emit

This module provides a helper for [[Cache]] decorator. to add a emit events caused by side-effect.

## Example

```js
import addEmit from 'core/cache/decorators/emit';
import SimpleCache from 'core/cache/simple';

const
  cache = new SimpleCache();

// originalRemove did not emit remove event
const { remove: originalRemove, subscribe } = addEmit(cache);

// Now cache.eventEmitter emit event 'remove' with args [cache(instance what call emit), [...args]]
cache.remove('foo');

// (eventName, instanceOfListener, callback) - callback invoked only if emit was made by children of instanceOfListener;
subscribe('remove', cache, (key) => { console.log(key) });
```
