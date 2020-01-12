# core/semver

This module provides a function for comparing string versions using semver strategy.

```js
import check from 'core/semver';

console.log(check('1.4.1', '1.5.2', '>'));  // false
console.log(check('1', '1.5.2', '=='));     // true
console.log(check('2.4.1', '2.4', '<='));   // true
console.log(check('2.4', '2.4.2', '^='));   // true
```
