# core/semver

This module provides a function to compare string versions by using semver strategy.

### Supported Comparisons

> Note:
> The module currently supports only a numeric comparison with x-ranges. Without `beta`, `alpha` or `rc` postfixes.

- `==` equal
- `^=` caret range
- `>` greater than
- `<` less than
- `>=` greater than or equal to
- `<=` less than or equal to

### Examples

```js
import check from 'core/semver';

console.log(check('1.4.1', '1.5.2', '>'));  // false
console.log(check('1', '1.5.2', '=='));     // true
console.log(check('2.4.1', '2.4', '<='));   // true
console.log(check('2.4', '2.4.2', '^='));   // true
```
