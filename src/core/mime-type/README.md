# core/mime-type

This module provides API to extract data types from mime-type/DATA:URI strings.

```js
import { getDataType, getDataTypeFromURL } from 'core/mine-type';

console.log(getDataType('application/json')); // json

console.log(getDataTypeFromURL('data:application/javascript;...')); // text
```
