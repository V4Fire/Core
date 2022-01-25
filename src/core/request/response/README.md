# core/request/response

This module provides a class to work with server response data.
The class' API is pretty similar to native the [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) class
but has some extra functionality. The class doesn't implement native Response static methods.

## Why not just use the native Response class?

Because, the `core/request` module can use different engines, but not only `fetch` or `XMLHttpRequest`.
These engines can have different peculiarities, so we need to create a new abstraction.

## Difference between native and V4 Response classes

There are a few differences between these classes:

1. The `body` property is not a stream object. Instead, it contains raw response data used to initialize an instance.
2. Each Response instance is an async iterable object. So you can use this feature to process the response as a stream.
   Notice, not every request engine can stream response.

  ```js
  import request from 'core/request';
  import fetchEngine from 'core/request/engines/fetch';

  for await (const chunk of request('//movie', {engine: fetchEngine})) {
    console.log(chunk.data, chunk.total, chunk.loaded);
  }
  ```

## Extra API

### methods

#### decode

Parses the response body and returns a promise with the result.
The operation result is memoized, and you can't parse the response as a stream after invoking this method.

A way to parse data is based on the response `Content-Type` header or a passed `responseType` constructor option.
Also, a sequence of decoders is applied to the parsed result if they are passed with a `decoders`constructor option.

```js
import request from 'core/request';

request('//foo.jpg')
  .then(({response}) => esponse.decode())
  .then((img) => console.log(img instanceof Blob));

request('//users', {decoders: [parseProtobuf, normalizeUsers], responseType: 'arrayBuffer'})
  .then(({response}) => esponse.decode())
  .then((users) => console.log(users));
```
