# core/async/modules/wrappers

This module provides Async wrappers for data-providers and event-emitters.

### Data-providers

```js
import Async from 'core/async';
import Provider from 'core/data';

const
  rawDataProvider = new Provider(),
  watcher = new Async();

const dp = watcher.wrapDataProvider(rawDataProvider);

dp.method('POST').get('foo');
```

### Event-emitters
```js
import Async from 'core/async';

const
  watcher = new Async();

const wrappedEventEmitter = watcher.wrapEventEmitter(window);

const handler = () => console.log('scroll event');

// Alias for wrappedEventEmitter.on
wrappedEventEmitter.addEventListener('scroll', handler, {
  capture: true,
  label: 'label',
});

// Alias for wrappedEventEmitter.off
wrappedEventEmitter.removeEventListener('scroll', handler);
```
