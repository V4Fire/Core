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
2. Each `Response` instance is an async iterable object. So you can use this feature to process the response as a stream.
   Notice, not every request engine can stream response.

  ```js
  import request from 'core/request';
  import fetchEngine from 'core/request/engines/fetch';

  for await (const chunk of request('//movie', {engine: fetchEngine})) {
    console.log(chunk.data, chunk.total, chunk.loaded);
  }
  ```

## Extra API

### Events

| EventName           | Description                                           | Payload description | Payload |
|---------------------|-------------------------------------------------------|---------------------|---------|
| `bodyUsed`          | The response body has been read via `decode`          | -                   | -       |
| `streamUsed` | The response body has been read via an async iterator | -                   | -       |

### Constructor options

With creation of a Response instance you can pass a bunch of options.

```typescript
export interface ResponseOptions {
  url?: string;
  redirected?: boolean;
  type?: ResponseModeType;

  /**
   * Parent operation promise
   */
  parent?: AbortablePromise;

  /**
   * A meta flag that indicates that the request is important: is usually used with decoders to indicate that
   * the request needs to be executed as soon as possible
   */
  important?: boolean;

  status?: StatusCodes;
  statusText?: string;

  /**
   * List of status codes (or a single code) that match successful operation.
   * Also, you can pass a range of codes.
   */
  okStatuses?: OkStatuses;

  /**
   * Type of the response data
   */
  responseType?: ResponseType;

  /**
   * Set of response headers
   */
  headers?: RawHeaders;

  /**
   * Sequence of response decoders
   */
  decoder?: WrappedDecoder | WrappedDecoders;

  /**
   * Reviver function for `JSON.parse`
   * @default `convertIfDate`
   */
  jsonReviver?: JSONCb | false;
}
```

### Properties

#### emitter

Event emitter to broadcast response events.

```js
import request from 'core/request';

request('//foo.jpg')
  .then(({response}) => {
    response.emitter.once('bodyUsed', () => {
      console.log('Body has been read');
    });

    return response.decode();
  });
```

#### streamUsed

True, if the response body is already read as a stream.

### Methods

#### decode

Parses the response body and returns a promise with the result.
The operation result is memoized, and you can't parse the response as a stream after invoking this method.

A way to parse data is based on the response `Content-Type` header or a passed `responseType` constructor option.
Also, a sequence of decoders is applied to the parsed result if they are passed with a `decoders`constructor option.

```js
import request from 'core/request';

request('//foo.jpg')
  .then(({response}) => response.decode())
  .then((img) => console.log(img instanceof Blob));

request('//users', {decoders: [parseProtobuf, normalizeUsers], responseType: 'arrayBuffer'})
  .then(({response}) => response.decode())
  .then((users) => console.log(users));
```
