# core/json

This module provides a bunch of helper functions to serialize/parse JSON data.

## convertIfDate

A reviver for the `JSON.parse` method: converts all strings that is looks like a date to Date.

```js
import { convertIfDate } from 'core/json';

// true
console.log(JSON.parse('"2015-10-12"', convertIfDate).is(new Date(2015, 9, 12)));
```
