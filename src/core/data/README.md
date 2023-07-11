# core/data

This module provides API to create an abstraction under data — a data provider.
The provider grants methods to access and modify data that is represented as one logical instance.

For example, we need to create an API for a user in our application. Let's start with a simple REST architecture:

1. `GET user/:id` returns an object of user fields by the specified user id:

```js
import request from 'core/request';
request('user/1');
```

```json
{
  "id": 1,
  "name": "Andrey",
  "age": 30
}
```

2. `PUT user/:id` modifies a user by the specified id with some provided data and returns new data:

```js
import request from 'core/request';
request('user/1', {method: 'PUT', body: {age: 31}});
```

```json
{
  "id": 1,
  "name": "Andrey",
  "age": 31
}
```

3. `DELETE user/:id` deletes a user by the specified id:

```js
import request from 'core/request';
request('user/1', {method: 'DELETE'});
```

4. `POST user` creates a new user with the specified data and returns it:

```js
import request from 'core/request';
request('user', {method: 'POST', body: {name: 'Andrey', age: 30}});
```

```json
{
  "id": 2,
  "name": "Andrey",
  "age": 30
}
```

All of these handlers are associated with one data model that represents a user. Knowing this, we can create a class for this model.

```js
import request from 'core/request';

class User {
  url = 'user/';

  async get(id) {
    return (await request(this.url + id)).data;
  }

  async upd(id, body) {
    return (await request(this.url + id, {method: 'PUT', body})).data;
  }

  async del(id) {
    return (await request(this.url + id, {method: 'DELETE'})).data;
  }

  async add(body) {
    return (await request(this.url, {method: 'POST', body})).data;
  }
}
```

It might seem naive, but it works. Also, we need to create some API to submit the provider's events that allows notifying an application
if data was changed.

```js
import request from 'core/request';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

class User {
  url = 'user/';
  emitter = new EventEmitter();

  async get(id) {
    return (await request(this.url + id)).data;
  }

  async upd(id, body) {
    const {data} = await request(this.url + id, {method: 'PUT', body});
    this.emitter.emit('upd', data);
    return data;
  }

  async del(id) {
    const {data} = await request(this.url + id, {method: 'DELETE'});
    this.emitter.emit('del', data);
    return data;
  }

  async add(body) {
    const {data} = await request(this.url, {method: 'POST', body});
    this.emitter.emit('add', data);
    return data;
  }
}
```

Still looks fine and useful, but if we want to create more classes for other data instances, we need to make some kind
of superclass to avoid "copy-pasting" code lines. The superclass may also improve our API with added extra functionality,
such as support for socket events, middlewares, etc. This is exactly what `core/data` module does.

## Default interface

The `core/data` module provides the default interface for any data providers. If your class implements that interface,
you can use it as a data provider with any V4Fire modules. The interface is pretty similar to the example mentioned above of
a data class but realizes more common API. Let's take a look at it.

**core/data/interface**

```typescript
import { EventEmitterLike } from 'core/async';
import {

  CreateRequestOptions,
  RequestQuery,
  RequestMethod,
  RequestResponse,
  RequestBody

} from 'core/data';

import { ModelMethod } from 'core/data/interface';
export * from 'core/data/interface/types';

export default interface Provider {
  readonly providerName: string;

  readonly emitter: EventEmitterLike;

  name(): CanUndef<ModelMethod>;
  name(value: ModelMethod): Provider;

  method(): CanUndef<RequestMethod>;
  method(value: RequestMethod): Provider;

  base(): string;
  base(value: string): Provider;

  url(): string;
  url(value: string): Provider;

  dropCache(): void;

  get<T = unknown>(query?: RequestQuery, opts?: CreateRequestOptions<T>): RequestResponse;

  peek<T = unknown>(query?: RequestQuery, opts?: CreateRequestOptions<T>): RequestResponse;

  post<T = unknown>(body?: RequestBody, opts?: CreateRequestOptions<T>): RequestResponse;

  add<T = unknown>(body?: RequestBody, opts?: CreateRequestOptions<T>): RequestResponse;

  upd<T = unknown>(body?: RequestBody, opts?: CreateRequestOptions<T>): RequestResponse ;

  del<T = unknown>(body?: RequestBody, opts?: CreateRequestOptions<T>): RequestResponse;
}
```

Many of these methods look familiar, but we also have some new methods and properties:

1. `providerName` — contains the full name of a provider.
2. `name` — a pair of get/set methods to provide "logical" meaning for a request:

```js
// There will be fired the "init" event after successfully receiving the data
myProvider.name('init').get('foo');
```

Mind that the default V4Fire implementation of a data provider by default sends events for `upd`, `add`, `del` requests.
These events have the same name with methods that produce them.

3. `method` — a pair of get/set methods to provide a type of HTTP request:

```js
// The request uses POST to get data
myProvider.method('POST').get('foo');
```

4. `base` — a pair of get/set methods to provide a base URL for requests:

```js
// The request is addressed for https://google.com/foo
myProvider.base('https://google.com').get('foo');
```

5. `url` — a pair of get/set methods to provide URL for requests:

```js
// The request is addressed for https://google.com/foo
myProvider.url('https://google.com').get('foo');

// We can combine .base() and .url():
// The request is addressed for https://google.com/bla/baz
myProvider.base('https://google.com').url('bla/baz').get('foo');
```

6. `dropCache` — a method that drops any request cache.

7. `peek` — a request that logically is similar to the checking of API accessibility. It uses `HEAD` by default.

8. `post` — a request that sends to a server some data without any logical representation. It uses `POST` by default.

## Default implementation

In addition to the base interface of data providers, V4Fire provides an implementation that grants some extra functionality
and more flexibility.

```js
import Provider from 'core/data';

export default class User extends Provider {
  baseURL = 'user/:id';
}

const user = new User();
user.get({id: 1}).then((data) => {
  console.log(data);
})
```

### Constructor parameters

You can provide some parameters to a provider by using the constructor.

```js
import Provider from 'core/data';

export default class User extends Provider {
  baseURL = 'user/:id';
}

const user = new User({
  externalRequest: true,
  socket: true
});
````

The entire list of parameters:

```typescript
interface ProviderOptions {
  /**
   * List of additional data providers for the "get" method.
   * It can be useful if you have some providers that you want combine to one.
   */
  extraProviders?: FunctionalExtraProviders;

  /**
   * Provider alias: it is used with extra providers
   */
  alias?: string;

  /**
   * @see [[CreateRequestOptions.externalRequest]]
   * @default `false`
   */
  externalRequest?: boolean;

  /**
   * If true, then the provider is connected to a socket server
   * @default `false`
   */
  socket?: boolean;
}
```

### Registering a data provider as the multiton

You can register your data provider by a name in the global storage. For that case, you should use the special decorator `provider`.

```js
import Provider, { provider, providers } from 'core/data';

@provider
export default class User extends Provider {
  baseURL = 'user/:id';
}

console.log(providers['User']);
```

The name to register is taken from the class name of the provider. Also, you can declare a namespace that is concatenated with the name.

```js
import Provider, { provider, providers } from 'core/data';

@provider('base')
export default class User extends Provider {
  baseURL = 'user/:id';
}

console.log(providers['base.User']);
```

It can be useful to provide data providers to components as input properties:

```xml
<my-component dataProvider="base.User"></my-component>
```

### Decorating a request function

#### Request methods

The default implementation of a data provider has an association between HTTP request methods and provider methods:

```js
{
  /**
   * Default HTTP request method for the "get" method
   */
  getMethod: RequestMethod = 'GET';

  /**
   * Default HTTP request method for the "peek" method
   */
  peekMethod: RequestMethod = 'HEAD';

  /**
   * Default HTTP request method for the "add" method
   */
  addMethod: RequestMethod = 'POST';

  /**
   * Default HTTP request method for the "upd" method
   */
  updateMethod: RequestMethod = 'PUT';

  /**
   * Default HTTP request method for the "del" method
   */
  deleteMethod: RequestMethod = 'DELETE';
}
```

You allow to rewrite it in your subclass.

```js
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  baseURL = 'user/:id';
  getMethod = 'POST';
}
```

#### Base URL for requests

The base URL is the starting point for URLs of each request. You can provide one universal URL by using the `baseURL` parameter, but also,
you can specify the base URL for each particular method.

```js
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  baseURL = 'user/:id';
  baseAddURL = 'user/add';
  baseDeleteURL = 'user/:id/del';
}
```

##### URL interpolation

You can specify dynamic values within a URL string. For this case, just add a variable with `:` character before the name.
The interpolations' values are taken from a query object or request body (if it's represented as a simple JS object).
After interpolation, all values that are used will be dropped from the source object.

#### Middlewares

Middleware is a simple function invoked before each request and can modify some request parameters, like adding/removing HTTP headers, etc.
The function takes a request environment:

```typescript
{
  ctx: RequestContext<T>;
  opts: CreateRequestOptions<T>;
  globalOpts: GlobalOptions;
}
```

You can specify a sequence of middlewares to the provider, but notice that middlewares' order depends on the structure that you use
(hash doesn't preserve the order, but arrays/maps do it).

For example, we need to add some authorization header for every request of the provider.

```js
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  static middlewares = {
    addSession({opts: {headers}}) {
      headers['Authorization'] = 'bearer myJWTToken';
    }
  };

  baseURL = 'user/:id';
}
```

The result of a middleware function is ignoring, with the exceptions of promises and functions.
If some middleware returns a promise, it will be awaited.
If at least one of the middlewares returns a function, then the result of invoking the function will be returned as the request result.
It can help organize mocks of data and other similar cases when you don't want to execute a real request.

```js
import Provider, { provider, Response } from 'core/data';

@provider
export default class User extends Provider {
  static middlewares = {
    attachMocks() {
      return () => new Response({id: 1, name: 'Andrey'}, {
        status: 200,
        responseType: 'object'
      });
    }
  };

  baseURL = 'user/:id';
}
```

#### Encoders

The encoder is a subtype of a middleware function, but unlike the simple middleware, the encoder must return a value and provide it
to another encoder or a request, which means that a sequence of encoders is tied with the following order.
Encoders are using to convert data to another format before submitting it.
For example, your server demands that all request data must be represented as a protobuf value.

```js
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  static encoders = {
    upd: [toProtobuf]
  };

  baseURL = 'user/:id';
}
```

Note that unlike the `middlewares` parameter, the encoders are separated between provider methods, which means
that you should declare encoders for all your methods.

The encoder function has a signature:

```typescript
export interface Encoder<I = unknown, O = unknown> {
  (data: I, params: MiddlewareParams): O;
}
```

Where:

1. `data` is your data;
2. `params` is an environment of your request.

If some encoder returns a promise, it will be awaited.

#### Decoders

The decoder is another subtype of a middleware function, which is pretty similar to `encoder`, but unlike the encoder,
it converts data from a response to the provider format.

The decoder function has a signature:

```typescript
export interface Encoder<I = unknown, O = unknown> {
  (data: I, params: MiddlewareParams, response: Response): O;
}
```

The first parameters are equal to the encoder function. The last parameter contains a link to the response object.

```js
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  static decoders = {
    get: [fromProtobuf]
  };

  baseURL = 'user/:id';
}
```

If some encoder returns a promise, it will be awaited.

#### Custom request function

To create a request, all providers use the `core/request` module. If you need to provide some extra parameters of the request,
such as `contentType`, you can specify a factory to make these requests using an overload of the request function.

```js
import request from 'core/request';
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  static request = request({
    contentType: 'json',
    cacheStrategy: 'forever',
    cacheTTL: (10).seconds()
  });

  baseURL = 'user/:id';
}
```

#### Interpolation of headers

Headers of any request also support interpolation from request data, which is similar to `baseURL`.

```js
import request from 'core/request';
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  static request = request({
    header: {
      Accept: '${accept}'
    }
  });

  baseURL = 'user/:id';
}
```

##### Providing an API URL

You can specify the base URL for your API. It can be useful if you have different URLs for development, staging, and production.
The API URL is concatenated with the base URL of a provider.

```js
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  static request = request({
    api: {url: 'https://google.com'}
  });

  baseURL = 'user/:id';
}
```

The value can also be declared as a function that is invoked at each request.

```js
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  static request = request({
    api: {url: () => USE_PROD ? 'https://google.com' : 'https://dev.google.com'}
  });

  baseURL = 'user/:id';
}
```

Finally, if you specify the default API URL within `core/config/api`, you can provide some chunks of an API URL
that are applied to the base.

```js
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  static request = request({
    api: {
      domain3: () => () => USE_PROD ? '' : 'dev',
      zone: 'io'
    }
  });

  baseURL = 'user/:id';
}
```

### Composition of providers

You can create a composition of multiple providers that are fetching in parallel and merging to one data.
This mechanism is called "extraProviders". Mind that API work only for a get request.

```js
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  extraProviders = ({opts: {query}}) => ({
    'skills': {
      provider: 'Skills',
      query: {id: query.id}
    }
  });

  alias = 'user';
  baseURL = 'user/:id';
}

new User().get({id: 1}).then((data) => {
  // The main data from User provider is stored by an alias (if it's specified) or by a provider name
  console.log(data.user);

  // The extra data is stored by an alias (if it's specified) or by key name from the declaration
  console.log(data.skills);
});
```

#### Extra provider

The declaration object of an extra provider has a standard interface:

```typescript
type ExtraProviderConstructor =
  string |
  Provider |
  {new(opts?: ProviderOptions): Provider};

interface ExtraProvider {
  provider?: ExtraProviderConstructor;
  providerOptions?: ProviderOptions;
  query?: RequestQuery;
  request?: CreateRequestOptions;
  alias?: string;
}
```

* `provider` — full name of a provider or a link to the provider or the provider constructor;
* `providerOptions` — additional options for the provider constructor;
* `query` — query parameters for a provider get request;
* `request` — request parameters for the provider;
* `alias` — alias of data: the data is stored by a key from this value in the result object.

#### Static extra providers

If you don't need to provide dynamic parameters to a request, you can define a static object instead of a function.

```js
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  extraProviders = {
    'skills': {
      provider: 'Skills'
    }
  };

  alias = 'user';
  baseURL = 'user/:id';
}
```

### Extending one data provider from another provider

The data provider is a simple class that implements a special interface.
That's why to create a new provider that is extended parameters from another provider, you should create a simple subclass.

```js
import Provider, { provider } from 'core/data';

@provider
export class User extends Provider {
  static request = request({
    api: {url: 'https://google.com'}
  });

  static middlewares = {
    addSession({opts: {headers}}) {
      headers['Authorization'] = 'bearer myJWTToken';
    }
  };

  baseURL = 'user/:id';
}

@provider
export class User2 extends User {
  static request = User.request({
    contentType: 'json'
  });

  static middlewares = {
    ...User.middlewares,
    addABHeader({opts: {headers}}) {
      headers['X-AB'] = 'foo';
    }
  };
}
```

### Specifying data mocks

There is a standard middleware to organize a data mocking mechanism — `attackMock` middleware (it is used by default).

```js
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  static mocks = {
    PUT: [
      {
        body: {
          age: 31
        },

        response: {
          id: 1,
          name: "Andrey",
          age: 31
        }
      }
    ],

    GET: [{
      response: {
        id: 1,
        name: "Andrey",
        age: 30
      }
    }]
  };

  baseURL = 'user/:id';
}
```

Mind that the root keys of mocks represent HTTP methods, but not provider methods.
The values contain arrays of request objects to match: the algorithm finds the most suitable option and returns its response.
Also, the middleware supports dynamically casting responses:

```js
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  static mocks = {
    GET: [{
      response(params, response) {
        if (!params.opts.query?.id) {
          response.status = 400;
          return;
        }

        response.status = 200;

        return {
          id: 1,
          name: "Andrey",
          age: 30
        };
       }
    }]
  };

  baseURL = 'user/:id';
}
```

Finally, you can use dynamic importing with mocks:

```js
import Provider, { provider } from 'core/data';

@provider
export default class User extends Provider {
  static mocks = import('mocks/user.json');
  baseURL = 'user/:id';
}
```

#### Enabling data mocks for a provider

By default, all data mocks are disabled, but you can enable them just type to a console of a browser:

```js
// Enables mocks for the User provider
setEnv('mock', {patterns: ['User']});

// Enables mocks for all providers
setEnv('mock', {patterns: ['.*']});
```

The values of patterns are converted to RegExp objects and applied to provider names (including namespaces).
Config settings are stored within a local browser storage.
