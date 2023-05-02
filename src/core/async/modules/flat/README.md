# core/async/modules/flat

This module provides a function for flatly working with a sequence of promises.
The function uses the `Proxy` object for creating a chain of promises where each next promise gets a value from the previous one.

You can either specify a value that will be then wrapped in a `Promise` or a function which return value also will be wrapped in a `Promise`:

```typescript
import flatAsync from 'core/async/modules/flat';

function getData(): Promise<Array<Promise<number>>> {
  return Promise.resolve([Promise.resolve(21)]);
}

// "21"
const str1 = await flatAsync(getData)().at(0)?.toFixed();

// "21"
const str2 = await flatAsync(getData())[0].toFixed();
```

The function is also available as a static method of the `Async` class or as a method of its instance:

```typescript
import Async from 'core/async';

Async.flat(promise);

new Async().flat(promise);
```

The module provides a type `Promisify` for patching your entity fields:

```typescript
import type { Promisify } from 'core/async/modules/flat';

const val: Promisify<number> = Promise.resolve(21);

val
  .toString()
  .split('')
  .then()
  .catch()
  .finally();
```
