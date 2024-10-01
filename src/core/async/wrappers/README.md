# core/async/wrappers

This module provides a bunch of helpers to wrap some objects, like event emitters or data providers.

## wrapDataProvider

The wrapper takes a link to the "raw" data provider and returns a new object that based on the original,
but all async methods and properties are wrapped by Async.

Notice, the wrapped methods can take additional Async parameters, like group or label.

```js
import Async from 'core/async';
import Provider, { provider } from 'core/data';

@provider('api')
export default class User extends Provider {
  baseURL = 'user/:id';
}

const
  $a = new Async(),
  wrappedProvider = $a.wrapDataProvider(new User());

wrappedProvider.get({uuid: 1}).then((res) => {
  console.log(res);
});

// By default, all wrapped methods have a group name that is equal to the provider name.
// So we can use it to clear or suspend requests, etc.
$a.clearAll({group: 'api.User'})

wrappedProvider.update({uuid: 1}, {
  // All wrapped methods can take additional Async parameters as the second argument: `group`, `label` and `join`
  group: 'bla',
  label: 'foo',
  join: true,

  // Also, the second argument of the wrapped method can take the original parameters from a provider
  headers: {
    'X-Foo': '1'
  }

}).then((res) => {
  console.log(res);
});

// If we are providing a group to the method, it will be joined with the global group by using the `:` character
$a.suspendAll({group: 'api.User:bla'});

// Obviously, we can use a group as RegExp
$a.muteAll({group: /api\.User/});

// We can use any methods or properties from the original data provider
wrappedProvider.dropCache();
```

### Custom global group

By default, when the wrapper wraps the provider, it takes the provider name and passes it as a group to all wrapped methods.
This behavior brings a future to clear or suspend all requests from the wrapped provider by its name.
But we can provide a different global name when wrapping a provider.

```js
import Async from 'core/async';
import Provider, { provider } from 'core/data';

@provider('api')
export default class User extends Provider {
  baseURL = 'user/:id';
}

const
  $a = new Async(),
  dp1 = $a.wrapDataProvider(new User(), {group: 'foo'});

dp1.get({uuid: 1}).then((res) => {
  console.log(res);
});

$a.clearAll({group: 'foo'})
```

## wrapEventEmitter

The wrapper takes a link to the "raw" event emitter and returns a new object that based on the original,
but all async methods and properties are wrapped by Async.

Notice, the wrapped methods can take additional Async parameters, like group or label. In addition,
the wrapper adds new methods, like "on" or "off", to make the emitter API more standard.

```js
import Async from 'core/async';

const
  $a = new Async(),
  wrappedEventEmitter = $a.wrapEventEmitter(window);

const handler = () => console.log('scroll event');

// We can safely listen to emitter events, cause all emitter methods, like `addListener` or `on` are wrapped by Async.
const id = wrappedEventEmitter.addEventListener('scroll', handler, {
  // Notice, the third argument can take Async parameters in addition to the native emitter parameters
  capture: true,
  label: 'label'
});

// The wrapper preserves the original API of emitter methods, so we can call something like this
wrappedEventEmitter.removeEventListener('scroll', handler);

// Finally, the wrapper adds a bunch of standard methods to the emitter, like `on`, `once`, and other stuff.
// We can use their instead of the original methods to make our code more universal.
wrappedEventEmitter.once('resize', (e) => {
  console.log(e);
}, {group: 'resizers'});

$a.muteAll({group: 'resizers'});

// We can use any methods or properties from the original emitter
console.log(wrappedEventEmitter.name); // window.name
```

### Custom global group

Unlike the wrapper of data providers, the emitter wrapper doesn't have any default global group for operations,
but you can pass it manually.
This behavior brings a future to clear or suspend all events from the wrapped provider by its name.

```js
import Async from 'core/async';

const
  $a = new Async(),
  wrappedEventEmitter = $a.wrapEventEmitter(window, {group: 'windowEvents'});

wrappedEventEmitter.once('resize', (e) => {
  console.log(e);
});

$a.muteAll({group: 'windowEvents'});

wrappedEventEmitter.on('scroll', (e) => {
  console.log(e);
}, {
  // If we are providing a group to the method, it will be joined with the global group by using the `:` character
  group: 'scrolling'
});

$a.muteAll({group: 'windowEvents:scrolling'});
```

### Native API of emitters

As you can see, the wrapper creates a new object based on the original emitter and replaces some methods with the safely Async analogs.
The overridden methods preserve the original emitter API, but some interfaces are not supported to use.

```js
import Async from 'core/async';

const
  $a = new Async(),
  wrappedEventEmitter = $a.wrapEventEmitter(window, {group: 'windowEvents'});

// The wrapper does not support this kind of attaching listeners.
// The replaced method can take the second argument only as a function.
wrappedEventEmitter.addEventListener('scroll', {
  handleEvent: (e) => {
    console.log(e);
  }
})
```

## wrapStorage

The wrapper takes a link to the "raw" async storage and returns a new object that based on the original,
but all async methods and properties are wrapped by Async.

Notice, the wrapped methods can take additional Async parameters, like group or label.

```js
import Async from 'core/async';
import { asyncLocal } from 'core/kv-storage';

const
  $a = new Async(),
  wrappedStorage = $a.wrapStorage(asyncLocal);

wrappedStorage.set('someKey', 'someValue', {
  // All wrapped methods can take additional Async parameters as the last argument: `group`, `label` and `join`
  group: 'bla',
  label: 'foo',
  join: true,
}).then(async () => {
  console.log(await wrappedStorage.get('someKey') === 'someValue');
});

$a.suspendAll({label: 'foo'});
```

### Custom global group

The storage wrapper doesn't have any default global group for operations, but you can pass it manually.
This behavior brings a feature to clear or suspend all events from the wrapped provider by its name.

```js
import Async from 'core/async';
import { asyncLocal } from 'core/kv-storage';

const
  $a = new Async(),
  wrappedStorage = $a.wrapStorage(asyncLocal, {group: 'globalGroup'});

wrappedStorage.set('someKey', 'someValue').then(() => {
  console.log('yeah!');
});

$a.muteAll({group: 'globalGroup'});

wrappedStorage.get('someKey', {
  // If we are providing a group to the method, it will be joined with the global group by using the `:` character
  group: 'localGroup'
}).then((val) => {
  console.log(val) === 'someValue';
});

$a.clearAll({group: 'globalGroup:localGroup'});
```

### Custom namespace

By default, a custom namespace have the same global group as the global namespace

```js
import Async from 'core/async';
import { asyncLocal } from 'core/kv-storage';

const
  $a = new Async(),
  wrappedStorage = $a.wrapStorage(asyncLocal, {group: 'bar'});

// We can provide own global group to namespace, it will be joined with the parent's global group
const blaStore = wrappedStorage.namespace('[[BLA]]', {group: 'bla'});

blaStore.clear({group: 'foo'});

$a.muteAll({group: 'bar:bla:foo'});
```
