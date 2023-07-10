# core/kv-storage/engines/string

This module provides an engine for storing key-value data within a single string.

## Why is this engine needed?

This engine enables serialization of all its data into a single string,
which can then be stored in any available storage.
This feature is particularly beneficial for saving data within cookies or any other storage system that imposes a
limit on the total number of entries.

### How is the data serialized into a string?

To save multiple values from a dictionary into a string, two separators are used:

* the `chunk` separator separates one "key-value" pair from another;
* the `record` separator separates the key from the value.

You can specify the separators to be used when creating an instance of the engine.

```js
import StringEngine from 'core/kv-storage/engines/string';

const store = new StringEngine({separators: {chunk: ';', record: '='}});

store.set('a', '1');
store.set('b', '2');
store.set('c', '3');

console.log(store.serializedData); // a=1;b=2;c=3

console.log(store.get('a')); // 1

console.log(store.has('b')); // true

store.remove('c');

console.log(store.serializedData); // a=1;b=2
```

By default, safe separator values are used that can be easily used within a single cookie.

```js
import StringEngine from 'core/kv-storage/engines/string';

const store = new StringEngine();

store.set('a', '1');
store.set('b', '2');

console.log(store.serializedData); // a{{.}}1{{#}}b{{.}}2
```

## How to use this engine?

The engine can be used independently along with the `kv-storage` module.

```js
import * as kv from 'core/kv-storage';
import StringEngine from 'core/kv-storage/engines/string';

const store = kv.factory(new StringEngine());

store.set('a', [1, 2, 3]);
store.set('b', 2);

console.log(store.get('a'));
```

Or, you can inherit from this engine and create a new engine with additional functionality or customization.
For example, let's create an engine for storing data in one cookie.

```typescript
import StringEngine from 'core/kv-storage/engines/string';

import * as cookie from 'core/cookies';

export default class CookieEngine extends StringEngine {
  protected cookieName: string;
  protected setOptions: cookie.SetOptions;

  constructor(cookieName: string, setOpts?: cookie.SetOptions) {
    super();
    this.cookieName = cookieName;
    this.setOptions = setOpts ?? {};
  }

  override get serializedData(): string {
    return cookie.get(this.cookieName) ?? '';
  }

  override set serializedData(data: string) {
    if (data.length === 0) {
      cookie.remove(this.cookieName, Object.select(this.setOptions, ['path', 'domains']));

    } else {
      cookie.set(this.cookieName, data, this.setOptions);
    }
  }
}
```

## API

### Predefined Instances

The module exports two predefined instances of the engine.

```js
import * as kv from 'core/kv-storage';
import { syncSessionStorage, asyncSessionStorage } from 'core/kv-storage/engines/string';

const store = kv.factory(syncSessionStorage);

store.set('a', [1, 2, 3]);
store.set('b', 2);

console.log(store.get('a'));
```

### Constructor

The engine's constructor can accept additional initialization options.

```js
import StringEngine from 'core/kv-storage/engines/string';

const store = new StringEngine({data: 'a=1;b=2', separators: {chunk: ';', record: '='}});

store.get('a'); // 1
store.get('b'); // 2
```

```typescript
interface StorageOptions {
  /**
   * Initial data for the storage, serialized into a string
   */
  data?: string;

  /**
   * Separators for keys and values for serialization into a string
   */
  separators?: DataSeparators;
}

interface DataSeparators {
  /**
   * This separator separates one "key-value" pair from another
   * @default `'{{#}}'`
   */
  chunk: string;

  /**
   * This separator separates the key from the value
   * @default `'{{.}}'`
   */
  record: string;
}
```

### Accessors

#### serializedData

Accessor for serialized data.
The getter is public, while the setter is protected.

```js
import StringEngine from 'core/kv-storage/engines/string';

const store = new StringEngine({separators: {chunk: ';', record: '='}});

store.set('a', '1');
store.set('b', '2');

console.log(store.serializedData); // a=1;b=2;c=3
```

### Methods

#### has

Returns true if a value by the specified key exists in the storage.

```js
import StringEngine from 'core/kv-storage/engines/string';

const store = new StringEngine();

console.log(store.has('a')); // false

store.set('a', '1');

console.log(store.has('a')); // true
```

#### get

Returns a value from the storage by the specified key.

```js
import StringEngine from 'core/kv-storage/engines/string';

const store = new StringEngine();

console.log(store.get('a')); // undefined

store.set('a', '1');

console.log(store.get('a')); // '1'
```

#### set

Stores a value to the storage by the specified key.

```js
import StringEngine from 'core/kv-storage/engines/string';

const store = new StringEngine();

console.log(store.has('a')); // false

store.set('a', '1');

console.log(store.has('a')); // true
```

#### remove

Removes a value from the storage by the specified key.

```js
import StringEngine from 'core/kv-storage/engines/string';

const store = new StringEngine();

store.set('a', '1');

console.log(store.has('a')); // true

store.remove('a');

console.log(store.has('a')); // false
```

#### keys

Returns a list of keys that are stored in the storage.

```js
import StringEngine from 'core/kv-storage/engines/string';

const store = new StringEngine();

store.set('a', '1');
store.set('b', '2');
store.set('c', '3');

console.log(store.keys()); // ['a', 'b', 'c']
```

#### clear

Clears either the entire data storage or records that match the specified filter.

```js
import StringEngine from 'core/kv-storage/engines/string';

const store = new StringEngine();

store.set('a', '1');
store.set('b', '2');
store.set('c', '3');

store.clear((el, key) => Number(el) > 1);

console.log(store.has('a')); // true
console.log(store.has('b')); // false
console.log(store.has('c')); // false

store.clear();

console.log(store.has('a')); // false
```
