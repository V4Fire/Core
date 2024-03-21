# core/request/engines/node

This module provides a function that creates a request engine for node.js scripts.

## Synopsis

* The engine is used by default in a node.js.
* The engine uses [Got](https://www.npmjs.com/package/got) as a request library.
* The engine supports response streaming.

## Example

```js
import nodeEngine from 'core/request/engines/node';

req('/search', {engine: nodeEngine}).then(({response}) => {
  console.log(response.decode());
});
```
