# core/async/modules/wrappers

This module provides a bunch of helpers to wrap some objects, like event emitters or data providers

## Data-providers

The wrapper takes a link to the "raw" data provider and returns a new object that based on the original, but all async methods and properties are wrapped by Async. Notice, the wrapped methods can take additional Async parameters, like group or label.

```js
import Async from 'core/async';
import Provider from 'core/data';

const
  rawDataProvider = new Provider(),
  watcher = new Async();

// If group not provided use class name as default group
const dp = watcher.wrapDataProvider(rawDataProvider, {group: 'example'});

// Async options `{group: 'example'}`
dp.method('POST').get('foo');

// Async options `{group: 'example:inner', label: 'label'}`
dp.method('POST').get('foo', {group: 'inner', label: 'label'});
```

## Event-emitters

The wrapper takes a link to the "raw" event emitter and returns a new object that based on the original, but all async methods and properties are wrapped by Async. Notice, the wrapped methods can take additional Async parameters, like group or label. In addition, the wrapper adds new methods, like "on" or "off", to make the emitter API more standard.

```js
import Async from 'core/async';

const
  watcher = new Async();

/**
 * If group provided will concatenate with inner group
 * 
 * wrapEventEmitter group | method group like addEventListener, on or once | result
 * 'outer'                | 'inner'                                        | 'outer:inner'
 * -------                | 'inner'                                        | 'inner'
 * 'outer'                | -------                                        | 'outer'
 */ 
const wrappedEventEmitter = watcher.wrapEventEmitter(window);

const handler = () => console.log('scroll event');

// Alias for `wrappedEventEmitter.on`
wrappedEventEmitter.addEventListener('scroll', handler, {
  capture: true,
  label: 'label',
});

// Alias for `wrappedEventEmitter.off`
wrappedEventEmitter.removeEventListener('scroll', handler);
```
