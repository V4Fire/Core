# core/request/engines/fetch

This module provides a function that creates a request engine based on the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
Mind, this API is developed to work in a browser — node.js support only for tests.

## Synopsis

* The engine is used by default in a browser if it supports `AbortController`.
* The engine supports response streaming.

## Example

```js
import fetchEngine from 'core/request/engines/fetch';

req('/search', {engine: fetchEngine}).then(({response}) => {
  console.log(response.decode());
});
```
