# core/object/watch

The module provides API to watch changes of JS objects, like, map-s, arrays, etc.
The watching supports different strategies: one based on rewriting property accessors, another one based on JS Proxy objects.
By default, is used the Proxy approach, if it supported by an execution environment, otherwise will be used the strategy of accessors.
You can manually define the strategy to use at each watcher.

```js
import watch from 'core/object/watch';

const obj = {
  a: 1,
  b: [],
  c: new Map(),
  d: {}
};

const {proxy, unwatch} = watch(obj, {deep: true, immediate: true}, (value, oldValue) => {
  console.log(value, oldValue);
});

proxy.a++;
proxy.b.push(1);
proxy.c.set(1, 2);
proxy.d.foo = 'bar';

unwatch();
```

## How it works?

The module provides a function to watch changes. The function takes an object to watch and can take some watching options,
and a callback function is invoked on each mutation of the observed object.
After this, the function returns API to watch changes. The API has an interface bellow.

```typescript
export interface Watcher<T extends object = object> {
  /**
   * A proxy object to watch
   */
  proxy: T;

  /**
   * Sets a new watchable value for the proxy object by the specified path
   *
   * @param path
   * @param value
   */
  set(path: WatchPath, value: unknown): void;

  /**
   * Deletes a watchable value from the proxy object by the specified path
   * @param path
   */
  delete(path: WatchPath): void;

  /**
   * Cancels watching for the proxy object
   */
  unwatch(): void;
}
```

Notice, the function creates a new object that wraps the original and adds watching functionality.
The new object is connected to the original, i.e. if you change a value of some property of the proxy object,
it will affect the original object. The connection works with the reverted direction too, when you change the original object,
but in this case, you can't watch these mutations.

```js
import watch from 'core/object/watch';

const user = {
  name: 'Kobezzza',
  age: 31
};

const {proxy} = watch(user, (value, oldValue) => {
  console.log(value, oldValue);
});

// This mutation will invoke our callback
proxy.name = 'Andrey';

// This mutation won't invoke our callback
user.age++;
```

Also, the API provides a function to remove watching from the proxy object.

```js
import watch from 'core/object/watch';

const user = {
  name: 'Kobezzza',
  age: 31
};

const {proxy, unwatch} = watch(user, (value, oldValue) => {
  console.log(value, oldValue);
});

// This mutation will invoke our callback
proxy.name = 'Andrey';

unwatch();

// This mutation won't invoke our callback
proxy.age++;
```

The rest two methods of API allow adding or removing properties to the proxy object.
If your environment supports Proxy objects, you can add new properties without invoking `set`,
but the invoking is necessary for a strategy based on accessors.

```js
import watch from 'core/object/watch';

import * as proxyEngine from 'core/object/watch/engines/proxy';
import * as accEngine from 'core/object/watch/engines/accessors';

const user = {
  name: 'Kobezzza',
  age: 31
};

const proxyWatcher = watch(user, {engine: proxyEngine}, (value, oldValue) => {
  console.log(value, oldValue);
});

// This mutation will invoke our callback
proxyWatcher.proxy.skils = ['programming', 'JS'];

const accWatcher = watch(user, {engine: accEngine}, (value, oldValue) => {
  console.log(value, oldValue);
});

// If we add a new property, we have to register a new accessor to watch.
// This mutation will invoke our callback.
accWatcher.set('skils', ['programming', 'JS']);

// Now we can change it without any doubt
accWatcher.skils = ['programming', 'JS', 'music'];
```

To delete a property from the proxy object, we can set it to undefined, use the `delete` operator or invoke the `delete` method of the watcher.
All of these methods have different semantic and work the same with any engine. Let's watch these in action.

```js
import watch from 'core/object/watch';

const user = {
  name: 'Kobezzza',
  age: 31
};

const watcher = watch(user, (value, oldValue) => {
  console.log(value, oldValue);
});

/* ***************** */
/* The first variant */
/* ***************** */

// This mutation will invoke our callback
watcher.proxy.age = undefined;

// true
console.log('age' in watcher.proxy);

// This mutation will invoke our callback
watcher.proxy.age = 32;

/* ****************** */
/* The second variant */
/* ****************** */

// This mutation won't invoke our callback
delete watcher.proxy.age;

// false
console.log('age' in watcher.proxy);

// This mutation won't invoke our callback
watcher.proxy.age = 32;

// Invoke set to register a property to watch.
// This mutation will invoke our callback.
watcher.set('age', 31)

// This mutation will invoke our callback
watcher.proxy.age = 32;

/* ***************** */
/* The thrid variant */
/* ***************** */

// This mutation will invoke our callback
watcher.delete('age');

// false
console.log('age' in watcher.proxy);

// This mutation will invoke our callback
watcher.proxy.age = 32;
```
