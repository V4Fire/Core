# core/kv-storage

This module provides API to work with a persistent key-value storage using different runtime engines, like localStorage, indexedDb, SQLite, etc.

## Supported engines

* `browser.localstorage`
* `browser.indexeddb`
* `node.localstorage`

## Simple synchronous API

The module provides a bunch of functions to work with a long-term local storage.

```js
import * as kv from 'core/kv-storage';

kv.set('bla', 1);
console.log(kv.get('bla') === 1);
console.log(kv.has('bla') === true);

kv.set('obj', {a: 1});
console.log(kv.get('obj').a === 1);

kv.remove('bla');
kv.clear((el, key) => el.a === 1);
```

### Custom namespaces

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

### Local API engine

You can pass your storage API as a strategy to another function or method.

```typescript
import { local, SyncStorage } from 'core/kv-storage';

function foo(kv: SyncStorage): void {
  kv.set('bla', 1);
  console.log(kv.get('bla') === 1);
  console.log(kv.has('bla') === true);

  kv.set('obj', {a: 1});
  console.log(kv.get('obj').a === 1);

  kv.remove('bla');
  kv.clear((el, key) => el.a === 1);
}

foo(local);
```

## Async API

If you need to work with an asynchronous local storage, you can use `asyncLocal. The API is pretty similar to local, but its
methods return a promise instead of the raw result.

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

## Session API

If you need to store data only for a session, you can use `session` and `asyncSession` API-s.

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

## Specifying a custom engine

By default, in a browser, the module uses native `window.localStorage` and `window.sessionStorage` API-s, but you can
specify your engine by using the special factory function.

```js
import { factory } from 'core/kv-storage';

const syncStorage = factory(YourSyncStorage);
const asyncStorage = factory(YourSyncStorage, true);
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
