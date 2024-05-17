<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [core/request/engines/composition](#corerequestenginescomposition)
  - [Usage](#usage)
    - [Creating a Request Composition](#creating-a-request-composition)
    - [Using the `requestFilter` Property](#using-the-requestfilter-property)
    - [Handling Request Errors](#handling-request-errors)
    - [Using as a Provider Request Engine](#using-as-a-provider-request-engine)
      - [Basic Usage](#basic-usage)
      - [Making a POST Request](#making-a-post-request)
      - [Passing constructor parameters of a provider to child providers](#passing-constructor-parameters-of-a-provider-to-child-providers)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# core/request/engines/composition

This module provides an API (engine) for creating a composition of requests.
This engine can be used as an engine for request and, accordingly, as an engine for providers.
Mostly, this engine is designed specifically for use with providers.

## Usage

### Creating a Request Composition

Let's imagine that you frequently need to make requests to several different APIs.
To solve this problem, you can use a query composition engine:

```typescript
import request from 'core/request';
import { compositionEngine } from 'core/request/engines/composition';

const r = request({engine: compositionEngine([
  {
    request: (opts, params, {boundRequest}) => boundRequest(request('http://locahost:5555/json/1')),
    as: 'val1'
  },
  {
    request: (opts, params, {boundRequest}) => boundRequest(request('http://locahost:5555/json/2')),
    as: 'val2'
  },
])});

const data = await r('').data; // {val1: data, val2: data}
```

Here, you can notice the use of a function called `boundRequest`. What is it? This function establishes a connection between the request and the engine,
allowing the engine to implement cache flushing and destruction of requests created within the engine.
`boundRequest` can accept `RequestPromise`, `RequestResponseObject`, and `Provider` as input.

It is possible to use other approaches, for example, creating a simple function that will make several requests, and there is no arguing with you.
But as mentioned in the module description, first and foremost, this engine is needed to expand the capabilities of data providers.
Let's now consider how this engine helps to enhance the abilities of data providers.

### Using the `requestFilter` Property

Each «request» object has the `requestFilter` property.
The `requestFilter` is called before the request function is called.
If the `requestFilter` returns false, the request will not be called and, consequently,
there will be no data from this request in the response.
This allows you to implement various scenarios in which you, depending,
for example, on the query parameters, need to make one or another request.

```typescript
const r = request({engine: compositionEngine([
  {
    request: (opts, params, {boundRequest}) => boundRequest(request('http://locahost:5555/json/1')),
    as: 'val1',
    requestFilter: (opts, params) => opts.query.auth != null
  },
  {
    request: (opts, params, {boundRequest}) => boundRequest(request('http://locahost:5555/json/2')),
    as: 'val2'
  },
])});
```

### Handling Request Errors

By default, if an error occurs in the `request` function, the engine will ignore it and continue making other requests.
However, this behavior can be changed. For example, you can set the `failCompositionOnError` property of the request object to `true`.
In this case, if there is an error in the request function of this request object,
it will be thrown as a `ComposedProvider` request error.

```typescript
const r = request({engine: compositionEngine([
  {
    request: (opts, params, {boundRequest}) => boundRequest(request('http://locahost:5555/json/1')),
    as: 'val1',
    failCompositionOnError: true
  },
  {
    request: (opts, params, {boundRequest}) => boundRequest(request('http://locahost:5555/json/2')),
    as: 'val2'
  },
])});

try {
  await r('').data;
} catch (error) {
  // If the first request encountered an error, the engine will not return any data,
  // it will crash with an error and return the error with which the first request ended.
}
```

If both request objects have the failCompositionOnError flag set, the error will be thrown as soon as any of them responds with an error.
However, this behavior can be changed by setting the aggregateErrors flag,
which will alter the engine's behavior in this situation.
If the flag is set to true, the engine will wait for all requests to complete and gather errors from
all requests that have the failCompositionOnError flag set.
Additionally, instead of the request's own error,
the engine will return an AggregateError that will contain all the errors from the requests.

```typescript
const r = request({engine: compositionEngine([
  {
    request: (opts, params, {boundRequest}) => boundRequest(request('http://locahost:5555/json/1')),
    as: 'val1',
    failCompositionOnError: true
  },
  {
    request: (opts, params, {boundRequest}) => boundRequest(request('http://locahost:5555/json/2')),
    as: 'val2',
    failCompositionOnError: true
  },
], aggregateErrors: true)});

try {
  await r('').data;
} catch (error) {
  // If one or both requests end with errors, the error here will be an AggregateError
  // that will contain the errors from the requests.
}
```

### Using as a Provider Request Engine

#### Basic Usage

Let's say we want to have a provider that makes 3 requests, two in parallel and one depending on the response of the first request.
Let's implement a provider that works this way:

```typescript
@provider
class Provider1 extends Provider {
  override baseURL: string = 'http://localhost:5000/json/1';
}

@provider
class Provider2 extends Provider {
  override baseURL: string = 'http://localhost:5000/json/2';
}

@provider
class Provider3 extends Provider {
  override baseURL: string = 'http://localhost:5000/json/3';
}

@provider
class MainProvider extends Provider {
  static override request: Provider['request'] = Provider.request({
    engine: compositionEngine([
      {
        request: (opts, params, {boundRequest}) => {
          const result = {
            val1: undefined,
            val2: undefined

          }

          const val1 = await boundRequest(new Provider1()).get().data;
          result.val1 = val1;

          if (val1.needAnotherRequest) {
            const val2 = await boundRequest(new Provider2()).get().data;
            result.val2 = val2;
          }

          return result;
        },
        as: 'request1'
      },
      {
        request: (opts, params, {boundRequest}) => boundRequest(new Provider3()).get(),
        as: 'request2'
      }
    ])
  });
}

const data = await new MainProvider().get().data;
console.log(data) // {request1: {val1: data, val2: data}, request2: data}
```

#### Making a POST Request

Also, in the composition, you can use not only the GET request method, but also POST (or any other method).
For example, you can implement a provider that, depending on the invoked method, calls different methods in child providers:

```typescript
@provider
class Provider1 extends Provider {
  override baseURL: string = 'http://localhost:5000/json/1';
}

@provider
class Provider2 extends Provider {
  override baseURL: string = 'http://localhost:5000/json/2';
}

class MainProvider extends Providers {
  static override request: Provider['request'] = Provider.request({
    engine: compositionEngine([
      {
        request: (opts, params, {boundRequest}) => {
          if (opts.method === 'GET') {
            const data = await boundRequest(new Provider1()).get().data;

            return {
              getData: data
            }
          }

          const data = await boundRequest(new Provider1()).post().data;

          return {
            postData: data
          }
        },
        as: 'request1'
      },
      {
        request: (opts, params, {boundRequest}) => boundRequest(new Provider2()).get(),
        as: 'request2'
      }
    ])
  });
}

const getData = await new MainProvider().get().data; // {request1: {getData: data}, request2: data};
const postData = await new MainProvider().post().data // {request1: {postData: data}, request2: data};
```

#### Passing constructor parameters of a provider to child providers

There may also be a need to pass constructor parameters of a provider to child providers.
The parameters with which the provider was created are passed in the third argument in the providerOptions object.

```typescript
@provider
class Provider1 extends Provider {
  override baseURL: string = 'http://localhost:5000/json/1';
}

@provider
class MainProvider extends Provider {
  static override request: Provider['request'] = Provider.request({
    engine: compositionEngine([
      {
        request: (opts, params, {boundRequest, providerOptions}) => boundRequest(new Provider1(providerOptions)).get(),
        as: 'request1'
      },
      ...
    ])
  });
}

const provider = new MainProvider({remoteState: {i18n: {}});
```
