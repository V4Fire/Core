# core/object/watch

The module provides API to watch changes of JS objects, like, maps, arrays, etc.
The watching supports different strategies:

* based on rewriting property accessors (ES5 runtime);
* based on JS Proxy objects (ES6 runtime).

By default, if runtime supports Proxy objects, then will be used an approach based on these objects.
Otherwise, will be used a strategy based on accessors. Also, you can manually define a strategy to use for each watcher.

```js
import watch from 'core/object/watch';

const obj = {
  a: 1,
  b: [],
  c: new Map(),
  d: {}
};

const {proxy, unwatch} = watch(obj, {deep: true, immediate: true}, (value, oldValue, info) => {
  console.log(value, oldValue, info.path);
});

proxy.a++;
proxy.b.push(1);
proxy.c.set(1, 2);
proxy.d.foo = 'bar';

unwatch();
```

## How it works?

The module provides a function to watch changes. It takes an object to watch, optionally some watching options,
and a callback function that accumulates mutations and invokes on the next tick after the first mutation.
After this, the function returns API to watch changes. The API has an interface below.

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

The function to watch supports: objects, arrays, Map-s, Set-s.

```js
import watch from 'core/object/watch';

const user = new Map([
  ['name', 'Kobezzza'],
  ['age', 31]
]);

const {proxy} = watch(user, (mutations) => {
  mutations.forEach(([value, oldValue, info]) => {
    console.log(value, oldValue, info.path);
  });
});

// This mutation will invoke our callback
proxy.set('name', 'Andrey');
```

Notice, the function creates a new object that wraps the original and adds the watching functionality.
The new object is connected to the original, and if you change the value of some property of the proxy object,
it will affect the original object. The connection works with the reverted direction too, when you change the original object,
but in this case, you can't watch these mutations.

```js
import watch from 'core/object/watch';

const user = {
  name: 'Kobezzza',
  age: 31
};

const {proxy} = watch(user, (mutations) => {
  mutations.forEach(([value, oldValue, info]) => {
    console.log(value, oldValue, info.path);
  });
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

const {proxy, unwatch} = watch(user, (mutations) => {
  mutations.forEach(([value, oldValue, info]) => {
    console.log(value, oldValue, info.path);
  });
});

// This mutation will invoke our callback
proxy.name = 'Andrey';

unwatch();

// This mutation won't invoke our callback
proxy.age++;
```

The rest two methods of the API allow adding or removing properties to the proxy object.
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

const proxyWatcher = watch(user, {engine: proxyEngine}, (mutations) => {
  mutations.forEach(([value, oldValue, info]) => {
    console.log(value, oldValue, info.path);
  });
});

// This mutation will invoke our callback
proxyWatcher.proxy.skils = ['programming', 'JS'];

const accWatcher = watch(user, {engine: accEngine}, (mutations) => {
  mutations.forEach(([value, oldValue, info]) => {
    console.log(value, oldValue, info.path);
  });
});

// If we add a new property, we have to register a new accessor to watch.
// This mutation will invoke our callback.
accWatcher.set('skils', ['programming', 'JS']);

// Now we can change it without any doubt
accWatcher.skils = ['programming', 'JS', 'music'];
```

To delete a property from the proxy object, we can set it to `undefined`, or use the `delete` operator,
or invoke the `delete` method of the watcher. All of these methods have different semantic and work the same with any engine.
Let's watch these in action.

```js
import watch from 'core/object/watch';

const user = {
  name: 'Kobezzza',
  age: 31
};

const watcher = watch(user, (mutations) => {
  mutations.forEach(([value, oldValue, info]) => {
    console.log(value, oldValue, info.path);
  });
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
/* The third variant */
/* ***************** */

// This mutation will invoke our callback
watcher.delete('age');

// false
console.log('age' in watcher.proxy);

// This mutation will invoke our callback
watcher.proxy.age = 32;
```

## Parameters of a mutation handler

A function that handles mutations can take a list of mutations or a single mutation.
The list of mutations contains sub-arrays, where the first two parameters refer to new and old values of the mutated property.
The third parameter refers to an object that contains some information about a particular mutation, like, where the mutation has occurred.
In case when the function takes a single mutation, the function tree arguments instead of one.

```typescript
interface WatchHandlerParams {
  /**
   * Link to the object that is watched
   */
  obj: object;

  /**
   * Link to the root object of watching
   */
  root: object;

  /**
   * Link to the top property of watching
   * (the first level property of the root)
   */
  top?: object;

  /**
   * Information about the parent mutation event
   */
  parent?: WatchHandlerParentParams;

  /**
   * True if the mutation has occurred on a prototype of the watched object
   */
  fromProto: boolean;

  /**
   * Path to a property that was changed
   */
  path: unknown[];

  /**
   * The original path to a property that was changed
   */
  originalPath: unknown[];
}

interface WatchHandlerParentParams {
  value: unknown;
  oldValue: unknown;
  info: WatchHandlerParams;
}
```

## Watching for the specific path

We can set watching not to the whole object properties, but only the property by the specified path.
To do it, just provide a path as the second parameter of the watching function.

```js
import watch from 'core/object/watch';

const user = {
  name: 'Kobezzza',
  skils: {
    programming: {
      js: 80,
      rust: 30
    },

    singing: 10
  }
};

const {proxy} = watch(user, 'skils.programming', (value, oldValue, info) => {
  console.log(value, oldValue, info.path, info.originalPath);
});

// This mutation won't invoke our callback
proxy.name = 'Andrey';

// This mutation will invoke our callback
// console.log: {js: 81, rust: 30} {js: 81, rust: 30} ['skils', 'programming'] ['skils', 'programming', 'js']
proxy.skils.programming.js++;

// Also, we can provide a path in the array form, like, ['skils', 'programming'].
// It helps provide a path with non-string keys.

const key = {};

const data = {
  map: new Map([[key, 1]])
};

const {proxy: proxy2} = watch(data, ['map', key], (value, oldValue, info) => {
  console.log(value, oldValue, info.originalPath);
});

proxy2.map.set(key, proxy2.map.get(key) + 1);
```

There are some nuances of using this approach:

* Because we watch the specific path, the callback function will take not a list of mutations, but just a single mutation.

  ```js
  import watch from 'core/object/watch';

  const user = {
    name: 'Kobezzza',
    skils: {
      programming: {
        js: 80,
        rust: 30
      },

      singing: 10
    }
  };

  const {proxy} = watch(user, (mutations) => {
    mutations.forEach(([value, oldValue, info]) => {
      console.log(value, oldValue, info.path);
    })
  });

  const {proxy: proxyByPath} = watch(user, 'skils.programming', (value, oldValue, info) => {
    console.log(value, oldValue, info.path);
  });
  ```

* Mutations of nested properties that match the path also invoke the callback.
  To get a path of the mutated property, use `info.originalPath`, because `info.path` always refers to the path that we watched.

  ```js
  import watch from 'core/object/watch';

  const user = {
    name: 'Kobezzza',
    skils: {
      programming: {
        js: 80,
        rust: 30
      },

      singing: 10
    }
  };

  const {proxy: proxyByPath} = watch(user, 'skils.programming', (value, oldValue, info) => {
    console.log(value, oldValue, info.originalPath);
  });

  // This mutation will invoke our callback
  // info.path: ['skils', 'programming']
  // info.originalPath: ['skils', 'programming', 'js']
  proxyByPath.skils.programming.js++;

  // This mutation will invoke our callback
  // info.path: ['skils', 'programming']
  // info.originalPath: ['skils', 'programming']
  proxyByPath.skils.programming = {js: 80, rust: 30, python: 30};

  // This mutation will invoke our callback
  // info.path: ['skils', 'programming']
  // info.originalPath: ['skils']
  proxyByPath.skils = {programming: {js: 80, rust: 30, python: 30, haskell: 20}};
  ```

* By default, all mutations that occur on the same tick are accumulated within a mutation list.
  The provided handler function is invoked on the next tick and takes the last value from this list as an argument, i.e., it works lazily.
  To force a watcher to invoke its handler immediately after the occurred mutation, provide the `immediate` option.
  To watch the whole list of mutations, provide the `collapse` option to `false`.

  ```js
  import watch from 'core/object/watch';

  const user = {
    name: 'Kobezzza',
    skils: {
      programming: {
        js: 80,
        rust: 30
      },

      singing: 10
    }
  };

  const {proxy: collapsedProxy} = watch(user, 'skils.programming', (value, oldValue, info) => {
    console.log(value, oldValue, info.originalPath);
  });

  collapsedProxy.skils.programming.js++;

  // This mutation overwrites the previous
  // console.log: {js: 80, rust: 30, python: 30} {js: 81, rust: 30} ['skils', 'programming']
  collapsedProxy.skils.programming = {js: 80, rust: 30, python: 30};

  const {proxy} = watch(user, (mutations) => {
    mutations.forEach(([value, oldValue, info]) => {
      console.log(value, oldValue, info.originalPath);
    })
  });

  // console.log: 81, 80, ['skils', 'programming', 'js']
  proxy.skils.programming.js++;

  // console.log: {js: 80, rust: 30} {js: 81, rust: 30, python: 30} ['skils']
  proxy.skils = {programming: {js: 80, rust: 30}};
  ```

* The provided handler function takes new and old values of a property by the provided path.
  Notice, if a mutation of some nested property occurs, the new and old values will be equal because they refer to the same object.
  To get values of changed nested properties, provide the `collapse` option to `false`.

  ```js
  import watch from 'core/object/watch';

  const user = {
    name: 'Kobezzza',
    skils: {
      programming: {
        js: 80,
        rust: 30
      },

      singing: 10
    }
  };

  const {proxy: collapsedProxy} = watch(user, 'skils.programming', (value, oldValue, info) => {
    console.log(value, oldValue, info.originalPath);
  });

  // console.log: {js: 81, python: 30} {js: 81, rust: 30} ['skils', 'programming', 'js']
  collapsedProxy.skils.programming.js++;

  const {proxy} = watch(user, (mutations) => {
    mutations.forEach(([value, oldValue, info]) => {
      console.log(value, oldValue, info.originalPath);
    })
  });

  // console.log: 82, 81, ['skils', 'programming', 'js']
  proxy.skils.programming.js++;
  ```

## Options of watching

### deep

By default, are watched only mutations from the top object properties, i.e., all nested mutations, are ignored.
To enable watching of nested properties, provide the `deep` option.

```js
import watch from 'core/object/watch';

const user = {
  name: 'Kobezzza',
  skils: {
    programming: 80,
    singing: 10
  }
};

const {proxy} = watch(user, {deep: true}, (mutations) => {
  mutations.forEach(([value, oldValue, info]) => {
    console.log(value, oldValue, info.path);
  });
});

// This mutation will invoke our callback
proxy.skils.singing++;
```

### withProto

By default, all mutations of properties from a prototype of the proxy object are ignored.
To enable watching of prototype properties, provide the `withProto` option.

```js
import watch from 'core/object/watch';

const user = {
  name: 'Kobezzza',
  __proto__: {
    age: 31
  }
};

const {proxy} = watch(user, {withProto: true}, (mutations) => {
  mutations.forEach(([value, oldValue, info]) => {
    console.log(value, oldValue, info.path, info.fromProto);
  });
});

// This mutation will invoke our callback
proxy.age++;
```

### immediate

By default, all mutations that occur on the same tick are accumulated within a mutation list.
The provided handler function is invoked on the next tick and takes the list of mutations as an argument, i.e., it works lazily.
To force a watcher to invoke its handler immediately after the occurred mutation, provide the `immediate` option.
In this case, the callback function doesn't take a list of mutations but parameters of the single mutation.

```js
import watch from 'core/object/watch';

const user = {
  name: 'Kobezzza',
  age: 31
};

const {proxy} = watch(user, {immediate: true}, (value, oldValue, info) => {
  console.log(value, oldValue, info.path);
});

// This mutation will invoke our callback
proxy.age++;
```

### collapse

The option enables or disables collapsing of mutation events.
When it toggles to `true`, all mutation events fire as if they occur on top properties of the watchable object.

```js
import watch from 'core/object/watch';

const user = {
  name: 'Kobezzza',
  skils: {
    programming: 80,
    singing: 10
  }
};

const {proxy} = watch(user, {collapse: true, deep: true}, (mutations) => {
  mutations.forEach(([value, oldValue, info]) => {
    console.log(value, oldValue, info.path);
  });
});

// {programming: 81, singing: 10} {programming: 81, singing: 10} ['skils', 'programming']
proxy.skils.programming++;
````

When it toggles to `false,` and the watcher binds to the specified path, the callback takes a list of mutations.
Otherwise, the callback takes only the last mutation.

```js
import watch from 'core/object/watch';

const user = {
  name: 'Kobezzza',
  skils: {
    programming: {
      js: 80,
      rust: 30
    },

    singing: 10
  }
};

const {proxy} = watch(user, 'skils.programming', {collapse: false}, (mutations) => {
  mutations.forEach(([value, oldValue, info]) => {
    console.log(value, oldValue, info.top, info.path, info.originalPath);
  });
});

// 81 80 {programming: {js: 81, rust: 30}, singing: 10} ['skils', 'programming'] ['skils', 'programming', 'js']
proxy.skils.programming.js++;

const {proxy: collapsedProxy} = watch({a: {b: {c: 1}}}, 'skils.programming', (value, oldValue, info) => {
  console.log(value, oldValue);
});

// {programming: {js: 82, rust: 30}, singing: 10} {programming: {js: 82, rust: 30}, singing: 10}
collapsedProxy.skils.programming.js++;
```

### pathModifier

A function that takes a path of the mutation event and returns a new path.
The function is used when you want to mask one mutation to another one.

```js
import watch from 'core/object/watch';

function pathModifier(path) {
  return path.map((chunk) => chunk.replace(/^_/, ''));
}

const {proxy} = watch({a: 1, b: 2, _a: 1}, 'a', {pathModifier}, (mutations) => {
  mutations.forEach(([value, oldValue, info]) => {
    console.log(value, oldValue, info.path, info.originalPath);
  });
});

// 2 1 ['a'], ['_a']
proxy._a = 2;
```

### eventFilter

A filter function for mutation events.
The function allows skipping some mutation events.

```js
import watch from 'core/object/watch';

function eventFilter(value, oldValue, info) {
  return info.path[0] !== '_a';
}

const {proxy} = watch({a: 1, b: 2, _a: 1}, {eventFilter}, (mutations) => {
  mutations.forEach(([value, oldValue, info]) => {
    console.log(value, oldValue, info.path, info.originalPath);
  });
});

// This mutation won't fire an event
proxy._a = 2;
```

### tiedWith

A link to an object that should connect with the watched object, i.e., changing of properties of the tied object, will also emit mutation events.

```js
import watch from 'core/object/watch';

const data = {
  foo: 2
};

class Bla {
  data = data;

  constructor() {
    watch(this.data, {tiedWith: this}, (val) => {
      console.log(val);
    });
  }
}

const bla = new Bla();
bla.foo = 3;
```

### prefixes

A list of prefixes for paths to watch. This parameter can help to watch getters.

```js
import watch from 'core/object/watch';

const obj = {
  get foo() {
    return this._foo * 2;
  },

  _foo: 2
};

const {proxy} = watch(obj, 'foo', {prefixes: ['_']}, (val) => {
  console.log(val);
});

// This mutation will invoke our callback
proxy._foo++;
```

### postfixes

A list of postfixes for paths to watch. This parameter can help to watch getters.

```js
import watch from 'core/object/watch';

const obj = {
  get foo() {
    return this.fooStore * 2;
  },

  fooStore: 2
};

const {proxy} = watch(obj, 'foo', {postfixes: ['Store']}, (val) => {
  console.log(val);
});

// This mutation will invoke our callback
proxy.fooStore++;
```

### dependencies

List of dependencies for paths to watch. This parameter can help to watch getters.

```js
import watch from 'core/object/watch';

const obj = {
  get foo() {
    return this.bla * this.baz;
  },

  bla: 2,
  baz: 3
};

const {proxy} = watch(obj, 'foo', {dependencies: ['bla', 'baz']}, (val) => {
  console.log(val);
});

// This mutation will invoke our callback
proxy.baz++;
```

### engine

A watch engine to use.
By default, will be used proxy if supported, otherwise accessors.

```js
import watch from 'core/object/watch';

import * as proxyEngine from 'core/object/watch/engines/proxy';
import * as accEngine from 'core/object/watch/engines/accessors';

const user = {
  name: 'Kobezzza',
  age: 31
};

const proxyWatcher = watch(user, {engine: proxyEngine}, (mutations) => {
  mutations.forEach(([value, oldValue, info]) => {
    console.log(value, oldValue, info.path);
  });
});

const accWatcher = watch(user, {engine: accEngine}, (mutations) => {
  mutations.forEach(([value, oldValue, info]) => {
    console.log(value, oldValue, info.path);
  });
});
```
