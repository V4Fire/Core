# core/request

This module provides API to request/submit data using different runtime engines, like XHR, Fetch, etc.

```js
import request from 'core/request';

request('https://foo.com', {
  method: 'POST',
  body: {
    bla: 'bar'
  }
}).then(async ({response}) => {
  console.log(await response.decode(), response.status);
});
```

## Supported engines

* `xhr`
* `fetch`
* `browser` (the engine uses `fetch` when it's possible, otherwise `xhr`)
* `node` (the engine uses [Got](https://www.npmjs.com/package/got) as a request library)
* `provider` (the engine based on `core/data` providers)

## API

The function has three overloads of usage.

### Creating a request

The first one creates a request based on the specified parameters.
As the first argument, the function takes a URL to request. The second argument is optional and declares additional request options.

```js
import request from 'core/request';

request('https://foo.com/users').then(async ({data, response}) => {
  console.log(await data, response.status);
});

request('https://foo.com/create-user', {method: 'POST', body: {name: 'Bob'}}).then(async ({data, response}) => {
  console.log(await data, response.status);
});
```

### Creating a new request function with the default request options

This overload is useful to create a wrapped request function.
It takes an object with request options and returns a new request function.
This function will use the passed options by default, but you can override them.
Finally, the result function can take another object with options and returns a new wrapped function recursively.
Parameters from the first and second invoke will be deeply merged.

```js
import request from 'core/request';

const post = request({method: 'POST'});

const postWithoutCredentials = request({method: 'POST', credentials: false});

postWithoutCredentials('https://foo.com/create-user', {body: {name: 'Bob'}}).then(async ({data, response}) => {
  console.log(await data, response.status);
});
```

### Creating a new request function with the default request options

The third overload helps to create a factory of requests.
It takes a URL to request, additional options (optional), and the special resolve function.
Then, it returns a new function to create requests with the passed options.

```js
import request from 'core/request';

const createUser = request(
  'https://foo.com/user',

  (url, {opts, globalOpts, ctx}, name, data) => {
    opts.body = data;

    // If the resolver function returns a string, it will be concatenated with the original request URL
    return name;
  },

  {
    method: 'POST'
  }
);

// POST: https://foo.com/user/bob
// BODY: {age: 37}
createUser('bob', {age: 37}).then(async ({data, response}) => {
  console.log(await data, response.status);
});

const wrappedRequest = request(
  'https://foo.com/user',

  (url, {opts, globalOpts, ctx}, name, data) => {
    opts.body = data;

    // If the resolver function returns an array of string, it will replace the original request URL
    return ['https://bla.com', 'bla', 'baz'];
  }
);

// GET: https://bla.com/bla/baz
wrappedRequest('bla', 'baz')
```

### Returning value of a request

After creating a request, the function returns an instance of `core/promise/abortable`.
The promise resolves with a special response object.

```typescript
interface RequestResponseObject<D = unknown> {
  // @see core/request/modules/context
  ctx: Readonly<RequestContext<D>>;

  // @see core/request/response
  response: Response<D>;

  // A promise with the response data
  data: Promise<Nullable<D>>;

  // An emitter to listen to raw request engine events
  emitter: EventEmitter;

  // An iterator to parse data in a stream form
  [Symbol.asyncIterator](): AsyncIterable<RequestResponseChunk>;

  // A type of the used cache if the data has been taken from it
  cache?: CacheType;

  // A method to drop cache of the request
  dropCache(): void;
}
```

```js
import request from 'core/request';

request('https://foo.com/users').then(async ({data, response}) => {
  console.log(await data, response.status);
});
```

Also, you can get `data`, `emitter` or `Symbol.asyncIterator` from a request promise.

```js
import request from 'core/request';
import xhr from 'core/request/engines/xhr';

request('https://foo.com/users').data.then((data) => {
  console.log(data);
});

request('https://foo.com/users', {engine: xhr}).emitter.on('readystatechange', (e) => {
  console.log(e);
});
```

#### Parsing response data in a stream form

If the used request engine supports streaming, you can use it via an async iterator.
Notice, you won't switch to another form when you read response as a whole data or in a stream form.

```js
import request from 'core/request';

(async () => {
  for await (const {loaded, total, data} of request('https://foo.com/users')) {
    console.log(loaded, total, data);
  }
});

request('https://foo.com/users').then(async (response) => {
  for await (const {loaded, total, data} of response) {
    console.log(loaded, total, data);
  }
});

request('https://foo.com/users').then(async ({response}) => {
  for await (const {loaded, total, data} of response) {
    console.log(loaded, total, data);
  }
});
```

Mind, the XHR engine partially supports streaming based on its `progress` event.

#### Listening to internal engine events

If the used request engine emits some events, you can listen there via the `emitter` property.
Mind, not every engine dispatch events.

```js
import request from 'core/request';
import xhr from 'core/request/engines/xhr';

const
  req = request('https://foo.com/users', {engine: xhr});

req.emitter.on('progress', (e) => {
  console.log(e);
});

req.emitter.on('upload.progress', (e) => {
  console.log(e);
});
```

### Request options

#### method

HTTP method to create a request.
[See more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

```js
import request from 'core/request';

request('//create-user', {
  method: 'POST',
  body: {name: 'Bob'}
}).data.then(console.log);
```

#### headers

Additional HTTP request headers. You can provide them as a simple dictionary or an instance of the Headers class.
Also, you can pass headers as an instance of the `core/request/headers` class.
[See more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers).

```js
import request from 'core/request';

request('//users', {
  headers: {
    Authorization: myJWT
  }
}).data.then(console.log);
```

#### credentials

Enables providing of credentials for cross-domain requests.
Also, you can manage to omit any credentials if the used request engine supports it.

```js
import request from 'core/request';
import fetchEngine from 'core/request/engines/fetch';

request('//users', {
  credentials: false
}).data.then(console.log);

request('//users', {
  engine: fetchEngine,
  credentials: 'omit'
}).data.then(console.log);
```

#### query

Request parameters that will be serialized to a string and passed via a request URL.
To customize how to encode data to a query string, see `querySerializer`.

```js
import request from 'core/request';

request('//user', {
  query: {id: 125}
}).data.then(console.log);
```

#### querySerializer

Returns a serialized value of the specified query object.

```js
import request from 'core/request';
import { toQueryString } from 'core/url';

request('//user', {
  query: {ids: [125, 35, 454]},
  querySerializer: (data) => toQueryString(data, {arraySyntax: true})
}).data.then(console.log);
```

#### body

Request body. Mind, not every HTTP method can send data in this way. For instance,
GET or HEAD requests can send data only with URLs (@see `query`).

```js
import request from 'core/request';

request('//create-user', {
  method: 'POST',
  body: {name: 'Bob'}
}).data.then(console.log);

const form = new FormData();

form.set('name', 'Garry');
form.set('age', '36');

request('//send-form', {
  method: 'POST',
  body: form
}).data.then(console.log);
```

#### contentType

A mime type of the request data (if not specified, it will be cast dynamically).

```js
import request from 'core/request';

request('//create-user', {
  method: 'POST',
  body: {name: 'Bob'},
  contentType: 'application/x-msgpack',
  encoder: toMessagePack
}).data.then(console.log);
```

#### responseType

Type of the response data (if not specified, it will be cast dynamically from the response headers):

1. `'text'` - the result is interpreted as a simple string;
2. `'json'` - the result is interpreted as a JSON string;
3. `'document'` - the result is interpreted as an XML/HTML document;
4. `'formData'` - result is interpreted as a FormData object;
5. `'blob'` - the result is interpreted as a Blob object;
6. `'arrayBuffer'` - the result is interpreted as an array buffer;
7. `'object'` - the result is interpreted "as is" without any converting.

```js
import request from 'core/request';

request('//users', {
  responseType: 'arrayBuffer',
  decoder: fromMessagePack
}).data.then(console.log);
```

#### [okStatuses = `new Range(200, 299)`]

List of status codes (or a single code) that match successful operation.
Also, you can pass a range of codes.

```js
import request from 'core/request';
import Range from 'core/range';

request('//users', {
  okStatuses: [200, 201]
}).data.then(console.log);

request('//users', {
  okStatuses: new Range(200, 210)
}).data.then(console.log);
```

#### timeout

A value in milliseconds for a request timeout.

```js
import request from 'core/request';

request('//users', {
  timeout: (10).seconds()
}).data.then(console.log);
```

#### retry

Options to retry bad requests or a number of maximum request retries.

```js
import request from 'core/request';

request('//users', {
  timeout: (10).seconds(),
  retry: 3
}).data.then(console.log);

request('//users', {
  timeout: (10).seconds(),
  retry: {
    attemps: 3,
    delay: (attemp) => attemp * (3).seconds()
  }
}).data.then(console.log);
```

```typescript
/**
 * @typeparam D - response data type
 */
export interface RetryOptions<D = unknown> {
  /**
   * Maximum number of attempts to request
   */
  attempts?: number;

  /**
   * Returns a number in milliseconds (or a promise) to wait before the next attempt.
   * If the function returns false, it will prevent all further attempts.
   *
   * @param attempt - current attempt number
   * @param error - error object
   */
  delay?(attempt: number, error: RequestError<D>): number | Promise<void> | false;
}
```

#### api

Map of API parameters.

If the API is specified, it will be concatenated with a request path URL. It can be useful to create
request factories. In addition, you can provide a function as a key value, and it will be invoked.
