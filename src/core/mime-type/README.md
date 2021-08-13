# core/mime-type

This module provides API to extract data types from mime-type/DATA:URI strings.

## getDataType

Returns a type of data from the specified mime type string.

```js
import { getDataType } from 'core/mine-type';

console.log(getDataType('application/json')); // json
```

## getDataTypeFromURI

Returns a type of data from the specified DATA:URI string.

```js
import { getDataTypeFromURI } from 'core/mine-type';

console.log(getDataTypeFromURI('data:application/javascript;...')); // text
```
