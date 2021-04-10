# core/cache/decorators/emit

This module provides a wrapper for [[Cache]] data structures to add a emit of events.

## Example

```js
import wrapEmit from 'core/cache/decorators/emit';
import SimpleCache from 'core/cache/simple';

const
  cache = new SimpleCache();

// Original remove not emit remove event
const { remove: originalRemove } = wrapEmit(cache);

// Now cache.eventEmitter emit event 'remove' with args ['foo']
cache.remove('foo');
```
