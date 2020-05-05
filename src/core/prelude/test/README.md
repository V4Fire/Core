# core/prelude/test

This module provides global API to write simple unit tests by using Jasmine library.

```js
function sum(a, b) {
  return a + b;
}

DEBUG && test('sum', (o) => {
  o.expect(sum(1, 2)).toBe(3);
})
```
