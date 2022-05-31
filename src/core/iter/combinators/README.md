# core/iter/combinators

This module provides a bunch of helpers to combine different iterable structures.

## seq

Takes iterable objects and returns a new iterator that produces values from them sequentially.

```js
import { seq } from 'core/iterr/combinators';

// [1, 2, 3, 4, 5, 6]
console.log([
  ...seq([1, 2], new Set([3, 4], [5, 6].values()))
]);
```

If the first passed object has an asynchronous iterator, the result iterator will also be asynchronous.

```js
import { intoIter } from 'core/iter';
import { seq } from 'core/iterr/combinators';
import { from, pick, andPick, assemble, streamArray } from 'core/json/stream';

const tokens = intoIter(from(JSON.stringify({
  total: 3,
  data: [
    {
      user: 'Bob',
      age: 21
    },
    {
      user: 'Ben',
      age: 24
    },
    {
      user: 'Rob',
      age: 28
    }
  ]
})));

const seq = seq(
  assemble(pick(tokens, 'total')),
  streamArray(andPick(tokens, 'data'))
);

for await (const val of seq) {
  // 3
  // {index: 0, value: {user: 'Bob', age: 21}}
  // {index: 1, value: {user: 'Ben', age: 24}}
  // {index: 2, value: {user: 'Rob', age: 28}}
  console.log(val);
}
```
