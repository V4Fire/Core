# core/uuid

This module provides API to generate, parse and serialize UUID strings and binary sequences.

```js
import { generate, serialize, parse } from 'core/uuid';

// Generates UUID v4
console.log(generate());

const
  uuid = new Uint8Array([174, 42, 253, 26, 185, 60, 17, 234, 179, 222, 2, 66, 172, 19, 0, 4]);

console.log(parse('ae2afd1a-b93c-11ea-b3de-0242ac130004')) // = uuid
console.log(serialize(uuid)) // 'ae2afd1a-b93c-11ea-b3de-0242ac130004'
```
