# core/data/middlewares/attach-mock

This module provides a middleware to attach mock data to a request.

## Usage

```js
import Provider, { provider } from 'core/data';
import attachMock from 'core/data/middlewares/attach-mock';

@provider
export default class User extends Provider {
  static middlewares = {
    attachMock
  };

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
import attachMock from 'core/data/middlewares/attach-mock';

@provider
export default class User extends Provider {
  static middlewares = {
    attachMock
  };

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
import attachMock from 'core/data/middlewares/attach-mock';

@provider
export default class User extends Provider {
  static middlewares = {
    attachMock
  };

  static mocks = import('mocks/user.json');

  baseURL = 'user/:id';
}
```

## Enabling data mocks for a provider

By default, all data mocks is disabled, but you can enable it just type to a console of a browser:

```js
// Enables mocks for the User provider
setEnv('mock', {patterns: ['User']});

// Enables mocks for all providers
setEnv('mock', {patterns: ['.*']});
```

The values of patterns are converted to RegExp objects and applied to provider names (including namespaces).
Config settings are stored within a local browser storage.
