# core/iter

This module provides a bunch of helpers to create and work with iterators.

## intoIter

Creates an iterator based on the specified object and returns it.
The function has various overloads:

1. If the passed value is a boolean, the function creates an infinite iterator.

  ```js
  import { intoIter } from 'core/iter';

  // From 0 to Infinity
  intoIter(true);

  // From 0 to Infinity
  intoIter(false);
  ```

2. If the passed value is `null` or `undefined`, the function creates an empty iterator.

  ```js
  import { intoIter } from 'core/iter';

  // []
  console.log([...intoIter(null)]);
  ```

3. If the passed value is a number, the function creates an iterator from zero to the specified number (non including).

  ```js
  import { intoIter } from 'core/iter';

  // [0, 1, 2]
  console.log([...intoIter(3)]);

  // [0, -1, -2]
  console.log([...intoIter(-3)]);
  ```

4. If the passed value is a string, the function creates an iterator over the string graphical letters.

  ```js
  import { intoIter } from 'core/iter';

  // ['f', 'o', 'o']
  console.log([...intoIter('foo')]);

  // ['1', '😃', 'à', '🇷🇺', '👩🏽‍❤️‍💋‍👨']
  console.log([...intoIter('1😃à🇷🇺👩🏽‍❤️‍💋‍👨')]);
  ```

5. If the passed value is a dictionary, the function creates an iterator over the dictionary values.

  ```js
  import { intoIter } from 'core/iter';

  // [1, 2]
  console.log([...intoIter({a: 1, b: 2})]);
  ```

6. If the passed value is a generator, the function creates a new iterator over it.

  ```js
  import { intoIter } from 'core/iter';

  // [1, 2]
  console.log(function* () { yield* [1, 2]; });
  ```

7. If the passed value is an async generator, the function creates a new async iterator over it.

  ```js
  import { intoIter } from 'core/iter';

  for await (const el of async function* () { yield* [1, 2]; }) {
    // 1
    // 2
    console.log(el);
  }
  ```

8. If the passed value is an iterable structure, the function creates a new iterator over it.

  ```js
  import { intoIter } from 'core/iter';

  // [1, 2]
  console.log([...intoIter([1, 2].values())]);
  ```

9. If the passed value is an async iterable structure, the function creates a new async iterator over it.

  ```js
  import { intoIter } from 'core/iter';

  for await (const el of (async function* () { yield* [1, 2]; })()) {
    // 1
    // 2
    console.log(el);
  }
  ```
