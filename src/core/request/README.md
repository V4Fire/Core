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
