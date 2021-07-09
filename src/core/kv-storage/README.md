# core/kv-storage

This module provides API to work with a persistent key-value storage using different runtime engines, like localStorage,
indexedDb, SQLite, etc.

## Supported engines

* `browser-localstorage`
* `browser-indexeddb`
* `node-localstorage`

## API

### Synchronous and asynchronous API

The module has interfaces to work with storage in a synchronous and asynchronous way.
In the case of asynchronous API, all defined methods have the same input parameters as the synchronous API but return promises.
Notice, not each engine implements the synchronous API, so we recommend preferring to use asynchronous API in most cases.

### API structure

Both API exposes methods to implement simple CRUD operations.

#### has

Returns true if a value by the specified key exists in the storage.
Notice, the method can take a list of additional parameters provided to the used storage' engine.

```js
import * as kv from 'core/kv-storage';

kv.set('bla', 1);
console.log(kv.has('bla') === true);
```

#### get

Returns a value from the storage by the specified key.

The returning value automatically parses by using `Object.parse` from a string to equivalent JS value, i.e.,
`'1'` will be parsed to `1`, `'true'` to `true`, `'2021-07-09T08:15:57.753Z'` to `Date`, etc.

Notice, the method can take a list of additional parameters provided to the used storage' engine.

```js
import * as kv from 'core/kv-storage';

kv.set('bla', 1);
console.log(kv.get('bla') === 1);
```

#### set

Saves a value to the storage by the specified key.

The value to parse automatically serializes to a string by using `Object.trySerialize`, i.e.,
arrays and dictionaries will be serialized to JSON, etc.

Notice, the method can take a list of additional parameters provided to the used storage' engine.

```js
import * as kv from 'core/kv-storage';

kv.set('bla', {a: 1});
console.log(kv.get('bla').a === 1);
```

#### remove

Removes a value from the storage by the specified key.
Notice, the method can take a list of additional parameters provided to the used storage' engine.

```js
import * as kv from 'core/kv-storage';

kv.set('bla', 1);
console.log(kv.has('bla') === true);

kv.remove('bla');
console.log(kv.has('bla') === false);
```

#### clear

Clears the storage by the specified filter and returns a list of removed keys.
Notice, the method can take a list of additional parameters provided to the used storage' engine.

```js
import * as kv from 'core/kv-storage';

kv.set('bla', 1);
kv.set('bla2', 2);

// ['bla']
kv.clear((el, key) => el === 1);

console.log(kv.has('bla') === false);
console.log(kv.has('bla2') === true);

// ['bla2']
kv.clear();

console.log(kv.has('bla2') === false);
```

#### namespace

All values are stored within a local storage in the global namespace, i.e., you can override any value you have.
If you want to isolate data from other data, you can specify the custom namespace. Mind, you still can override or remove these
values from the storage by using global API.

```js
import * as kv from 'core/kv-storage';

kv.set('bla', 1);

const blaStore = kv.namespace('[[BLA]]');

blaStore.set('baz', true);
blaStore.clear();

console.log(kv.has('bla') === true);

blaStore.set('foo', 1);

kv.clear();
console.log(blaStore.has('foo') === false);
```

### Asynchronous API

If you need to work with an asynchronous local storage, you can use `asyncLocal. The API is pretty similar to local, but its
methods return a promise instead of a raw result.

```js
import { asyncLocal } from 'core/kv-storage';

asyncLocal.set('bla', 1).then(async () => {
  console.log(await asyncLocal.get('bla') === 1);
});

const blaStore = asyncLocal.namespace('[[BLA]]');

blaStore.set('bla', 1).then(async () => {
  console.log(await blaStore.get('bla') === 1);
});
```

### Session API

If you need to store data only during the active session, you can use `session` and `asyncSession` API-s.

```js
import { session, asyncSession } from 'core/kv-storage';

session.set('bla', 1);
console.log(session.get('bla') === 1);
session.clear();

asyncSession.set('bla', 1).then(async () => {
  console.log(await asyncSession.get('bla') === 1);
});

const blaStore = asyncSession.namespace('[[BLA]]');

blaStore.set('bla', 1).then(async () => {
  console.log(await blaStore.get('bla') === 1);
});
```

### Providing API as a strategy

You can pass your storage API as a strategy to another function or method.

```typescript
import { local, asyncLocal, SyncStorage, AsyncStorage } from 'core/kv-storage';

function save(kv: SyncStorage): void {
  kv.set('bla', 1);
  console.log(kv.get('bla') === 1);
  console.log(kv.has('bla') === true);

  kv.set('obj', {a: 1});
  console.log(kv.get('obj').a === 1);

  kv.remove('bla');
  kv.clear((el, key) => el.a === 1);
}

save(local);

function asyncSave(kv: AsyncStorage): void {
  asyncLocal.set('bla', 1).then(async () => {
    console.log(await asyncLocal.get('bla') === 1);
  });
}

save(asyncLocal);
```

## Specifying engines to store

By default, in a browser, the module uses native `window.localStorage` and `window.sessionStorage` API-s.
Also, there is a storage based on `IndexedDb`. Use the `factory` method to specify an engine to store.

```js
import { factory } from 'core/kv-storage';
import * as idb from 'core/kv-storage/engines/browser-indexeddb';

const asyncStorage = factory(idb.asyncLocalStorage, true);

asyncStorage.set('bla', 1).then(async () => {
  console.log(await asyncLocal.get('bla') === 1);
});

const asyncSessionStorage = factory(idb.asyncSessionStorage, true);
```

### Specifying a custom engine

You can specify your engine by using the `factory` method.

```js
import { factory } from 'core/kv-storage';

const syncStorage = factory(YourSyncStorage);
const asyncStorage = factory(YourAsyncStorage, true);
```

The wrapped engine need to have CRUD methods from the interface:

```typescript
interface StorageEngine {
  get?(key: unknown): unknown;
  getItem?(key: unknown): unknown;
  set?(key: unknown, value: unknown): unknown;
  setItem?(key: unknown, value: unknown): unknown;
  remove?(key: unknown): unknown;
  removeItem?(key: unknown): unknown;
  delete?(key: unknown): unknown;
  exist?(key: unknown): unknown;
  exists?(key: unknown): unknown;
  includes?(key: unknown): unknown;
  has?(key: unknown): unknown;
  keys?(): Iterable<unknown>;
  clear?(): unknown;
  clearAll?(): unknown;
  truncate?(): unknown;
}
```
