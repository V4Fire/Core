# core/request/engines/xhr

This module provides a function that creates a request engine based on the [XMLHttpRequest API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).
Mind, this API is developed to work in a browser — node.js support only for tests.

## Synopsis

* The engine is used by default in a browser if it doesn't support `AbortController`.
* The engine partly supports response streaming (only `total`/`loaded` fields without `data`).
* The engine provides a bunch of internal events.

## Example

```js
import xhrEngine from 'core/request/engines/xhr';

const req = req('/search', {engine: xhrEngine}).then(({response}) => {
  console.log(response.decode());
});

req.emitter.on('progress', () => {
  // ..
});

req.emitter.on('upload.progress', () => {
  // ..
});
```
