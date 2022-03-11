# core/request

This module provides API to request/submit data using different runtime engines, like XHR, Fetch, etc.
The submodules contain different classes to work with HTTP headers, server responses and errors.

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

#### Request URL

There are two variants of request URL-s:

**absolute**

```js
import request from 'core/request';

request('https://foo.com/users').data.then(console.log);
```

**relative**

```js
import request from 'core/request';

request('/users').data.then(console.log);
```

In the case of a relative URL, the full request URL is based on the application `location`.

```js
import request from 'core/request';

// location.origin === 'https://foo.com';
// URL: https://foo.com/users
request('/users').data.then(console.log);

// location.origin.href === 'https://foo.com/bla';
// URL: https://foo.com/bla/users
request('users').data.then(console.log);
```

But also, you can define the base API URL within your application config. This URL will be used for any relative requests.

__config/index.ts__

```js
import { extend } from '@v4fire/client/config';

export default extend({
  api: 'https://api.foo.com'
});
```

__foo.ts__

```js
import request from 'core/request';

// URL: https://api.foo.com/users
request('/users').data.then(console.log);
```

In addition, you can read or write the `api` property from `core/request#globalOpts` or
through `globalOpts.api` property within your encoders/decoders/middlewares.

```js
import request, { globalOpts } from 'core/request';

console.log(globalOpts.api);

request('/users', {
  middlewares: {
    api: ({globalOpts}) => {
      if (globalOpts.api == null) {
        globalOpts.api = 'https://api.foo.com';
      }
    }
  }
}).data.then(console.log);
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

  // An asynchronous iterable object to parse the response in a stream form
  stream: AsyncIterableIterator<unknown>;

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
})();

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

If you want to process only stream data without `total` and `loaded` fields, use the `stream` getter.

```js
import request from 'core/request';

(async () => {
  for await (const data of request('https://foo.com/users').stream) {
    console.log(data);
  }
})();

request('https://foo.com/users').then(async (response) => {
  for await (const data of response.stream) {
    console.log(data);
  }
});

request('https://foo.com/users').then(async ({response}) => {
  for await (const data of response.decodeStream()) {
    console.log(data);
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

The request function can accept a bunch of optional parameters to make a request.

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

A request body. Mind, not every HTTP method can send data in this way.
For instance, GET or HEAD requests can send data only with URLs (@see `query`).

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

A type of the response data (if not specified, it will be cast dynamically from the response headers):

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

A list of status codes (or a single code) that match successful operation.
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
    attempts: 3,
    delay: (attempt) => attempt * (3).seconds()
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

A map of API parameters.

These parameters apply if the original request URL is not absolute, and they can be used to customize the
base API URL depending on the runtime environment. If you define the base API URL via
`config#api` or `globalOpts.api`, these parameters will be mapped on it.

```js
import request from 'core/request';

// URL (IS_PROD === true): https://foo.com/users
// URL (IS_PROD === false): https://foo.com/foo-stage

request('/users', {
  api: {
    protocol: 'https',
    domain2: () => IS_PROD ? 'foo' : 'foo-stage',
    zone: 'com'
  }
}).data.then(console.log);


// URL (globalOpts.api === 'https://api.foo.com' && IS_PROD === true): https://api.foo.com/users
// URL (globalOpts.api === 'https://api.foo.com' && IS_PROD === false): https://api.foo-stage.com/users

request('/users', {
  api: {
    domain2: () => IS_PROD ? 'foo' : 'foo-stage',
  }
}).data.then(console.log);
```

```typescript
export interface RequestAPI {
  /**
   * The direct value of API URL.
   * If this parameter is defined, all other parameters will be ignored.
   *
   * @example
   * `'https://google.com'`
   */
  url?: RequestAPIValue;

  /**
   * API protocol
   *
   * @example
   * `'http'`
   * `'https'`
   */
  protocol?: RequestAPIValue;

  /**
   * Value for an API authorization part
   *
   * @example
   * `'login:password'`
   */
  auth?: RequestAPIValue;

  /**
   * Value for an API domain level 6 part
   */
  domain6?: RequestAPIValue;

  /**
   * Value for an API domain level 5 part
   */
  domain5?: RequestAPIValue;

  /**
   * Value for an API domain level 4 part
   */
  domain4?: RequestAPIValue;

  /**
   * Value for an API domain level 3 part
   */
  domain3?: RequestAPIValue;

  /**
   * Value for an API domain level 2 part
   */
  domain2?: RequestAPIValue;

  /**
   * Value for an API domain zone part
   */
  zone?: RequestAPIValue;

  /**
   * Value for an API api port
   */
  port?: RequestAPIValue<string | number>;

  /**
   * Value for an API namespace part: it follows after '/' character
   */
  namespace?: RequestAPIValue;
}
```

#### cacheStrategy

A strategy of caching for requests that support caching (by default, only GET requests can be cached):

1. `'forever'` - caches all requests and stores their values forever within the active session or
   until the cache expires (if `cacheTTL` is specified);
2. `'queue'` - caches all requests, but more frequent requests will push less frequent requests;
3. `'never'` - never caches any requests;
4. Or, you can pass a custom cache object.

```js
import request from 'core/request';
import RestrictedCache from 'core/cache/restricted';

request('/users', {
  cacheStrategy: 'forever'
}).data.then(console.log);

request('/users', {
  cacheStrategy: new RestrictedCache(50)
}).data.then(console.log);
```

If you set a strategy using string identifiers, all requests will be stored within the global cache objects.

```js
import request, { cache } from 'core/request';

request('/users', {
  cacheStrategy: 'forever'
}).data.then(console.log);

cache.forever.clear();
```

#### cacheTTL

A value in milliseconds that indicates how long a request value should keep in the cache
(all requests are stored within the active session without expiring by default).

```js
import request from 'core/request';
import RestrictedCache from 'core/cache/restricted';

request('/users', {
  cacheStrategy: 'forever',
  cacheTTL: (10).minutes()
}).data.then(console.log);

request('/users', {
  cacheStrategy: new RestrictedCache(50),
  cacheTTL: (10).minutes()
}).data.then(console.log);
```

#### offlineCache

This option enables support of offline caching.
By default, a request can only be taken from a cache if there is no network.
You can customize this logic by providing a custom cache object with the `core/cache/decorators/persistent` decorator.

```js
import request from 'core/request';
import { asyncLocal } from 'core/kv-storage';

import addPersistent from 'core/cache/decorators/persistent';
import SimpleCache from 'core/cache/simple';

request('/users', {
  cacheStrategy: 'forever',
  offlineCache: true
});

const
  opts = {loadFromStorage: 'onInit'},
  persistentCache = await addPersistent(new SimpleCache(), asyncLocal, opts);

request('/users', {
  cacheStrategy: persistentCache
});
```

#### offlineCacheTTL

A value in milliseconds that indicates how long a request value should keep in the offline cache.

```js
import request from 'core/request';
import RestrictedCache from 'core/cache/restricted';

request('/users', {
  cacheStrategy: 'forever',
  offlineCache: true,
  offlineCacheTTL: (1).day()
});

request('/users', {
  cacheStrategy: new RestrictedCache(50),
  offlineCache: true,
  offlineCacheTTL: (1).day()
}).data.then(console.log);
```

#### [cacheMethods = `['GET']`]

A list of request methods that support caching.

```js
import request from 'core/request';

request('/users', {
  cacheStrategy: 'forever',
  cacheMethods: ['GET', 'POST']
}).data.then(console.log);
```

#### cacheId

A unique cache identifier: it can be useful to create request factories with isolated cache storages.

```js
import request from 'core/request';

const createUser = request(
  'https://foo.com/user',

  (url, {opts, globalOpts, ctx}, name, data) => {
    opts.body = data;
    return name;
  },

  {
    method: 'POST',
    cacheId: 'users'
  }
);

createUser('bob', {age: 37}).then(async ({data, response}) => {
  console.log(await data, response.status);
});
```

#### middlewares

A dictionary or iterable value with middleware functions: functions take an environment of request parameters and can modify theirs.
Please notice that the order of middleware depends on the structure you use.
Also, if at least one of the middlewares returns a function, invoking this function will be returned as the request result.
It can be helpful to organize mocks of data and other similar cases when you don't want to execute a real request.

```js
import request from 'core/request';

request('/users', {
  middlewares: {
    addAPI({globalOpts}) {
      if (globalOpts.api == null) {
        globalOpts.api = 'https://api.foo.com';
      }
    },

    addSession({opts}) {
      opts.headers.set('Authorization', myJWT);
    }
  }
}).data.then(console.log);

// Mocking response data
request('/users', {
  middlewares: [
    ({ctx}) => () => ctx.wrapAsResponse([
      {name: 'Bob'},
      {name: 'Robert'}
    ])
  ]
});
```

#### encoder

A function (or a sequence of functions) takes the current request data and returns new data to request.
If you provide a sequence of functions, the first function will pass a result in the next function from the sequence, etc.

```js
import request from 'core/request';

request('//create-user', {
  method: 'POST',
  body: {name: 'Bob'},
  contentType: 'application/x-msgpack',
  encoder: [normalize, toMessagePack]
}).data.then(console.log);
```

#### decoder

A function (or a sequence of functions) takes the current request response data and returns new data to respond.
If you provide a sequence of functions, the first function will pass a result to the next function from the sequence, etc.

```js
import request from 'core/request';

request('//users', {
  responseType: 'arrayBuffer',
  decoder: fromMessagePack
}).data.then(console.log);
```

#### streamDecoder

A function (or a sequence of functions) takes the current request response data chunk and yields a new chunk to respond via an async iterator.
If you provide a sequence of functions, the first function will pass a result to the next function from the sequence, etc.
This parameter is used when you're parsing responses in a stream form.

```js
import request from 'core/request';
import { streamArray } from 'core/json/stream';

const {stream} = request('//users', {
  responseType: 'json',
  streamDecoder: streamArray
});

(async () => {
  for await (const chunk of stream) {
    console.log(chunk);
  }
})();
```

#### [jsonReviver = `convertIfDate`]

A reviver function for `JSON.parse` or `false` to disable defaults.
By default, it parses some strings as Date instances.

#### meta

A dictionary with some extra parameters for the request: is usually used with middlewares to provide domain-specific information.

```js
import request from 'core/request';

request('/users', {
  meta: {addSession: true},

  middlewares: {
    addSession({opts}) {
      if (opts.meta.addSession) {
        opts.headers.set('Authorization', myJWT);
      }
    }
  }
}).data.then(console.log);
```

#### important

A meta flag that indicates that the request is important: is usually used with middlewares to indicate that
the request needs to be executed as soon as possible.

```js
import request from 'core/request';

request('/users', {
  important: true,

  middlewares: {
    doSomeWork({ctx}) {
      if (ctx.important) {
        // Do some work...
      }
    }
  }
}).data.then(console.log);
```

#### engine

This parameter defined a request engine to use.
The engine - is a simple function that takes request parameters and returns an abortable promise resolved with the `core/request/response` instance.
Mind, some engines provide extra features. For instance, you can listen to upload progress events with the XHR engine.
Or, you can parse responses in a stream form with the Fetch engine.

```js
import AbortablePromise from 'core/promise/abortable';

import request from 'core/request';
import Response from 'core/request/response';

import fetchEngine from 'core/request/engines/fetch';
import xhrEngine from 'core/request/engines/xhr';

request('//users', {
  engine: fetchEngine,
  credentials: 'omit'
}).data.then(console.log);

request('//users', {
  engine: xhrEngine
}).data.then(console.log);

request('//users', {
  engine: (params) => new AbortablePromise((resolve) => {
    const res = new Response({
      message: 'Hello world'
    }, {responseType: 'object'});

    resolve(res);

  }, params.parent)

}).data.then(console.log);
```
