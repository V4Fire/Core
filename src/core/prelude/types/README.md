# core/prelude/types

This modules extends the Object constructor with extra methods to check data types.

```
Object.isPlainObject({}); // true
Object.isArray({length: 0}); // false
Object.isArrayLike({length: 0}); // true
```
