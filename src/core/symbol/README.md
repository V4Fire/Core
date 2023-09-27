# core/symbol

This module provides a function to create unique symbols in a more flexible way.

```js
import symbolGenerator from 'core/symbol';

// All symbols produced from this constant will be automatically generated at the first touch.
// This mechanism is based on the JS Proxy API.
const
  $$ = symbolGenerator();

console.log($$.hi);

// The code above and the code below are the same
const
  hi = Symbol('hi');

console.log(hi);
```
