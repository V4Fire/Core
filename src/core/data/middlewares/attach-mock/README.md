# core/data/middlewares/attach-mock

This module provides a middleware to attach mock data to a request.

## Usage

```js
import Provider, { provider } from 'core/data';
import { attachMock } from 'core/data/middlewares';

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

Keep in mind that mock root keys represent HTTP methods, not provider methods.
The values contain arrays of query objects for matching: the algorithm finds the best match and returns its answer.
In addition, the middleware supports dynamic response casting.

```js
import Provider, { provider } from 'core/data';
import { attachMock } from 'core/data/middlewares';

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
    }],
    POST: [{
      response(params, response) {
        if (!params.opts.headers['authorization']) {
          response.status = 302;
          response.headers = {location: '/login'};
          return;
        }

        // authorize user
        // ...

        response.status = 201;
      }
    }]
  };

  baseURL = 'user/:id';
}
```

Finally, you can use dynamic importing with mocks.

```js
import Provider, { provider } from 'core/data';
import { attachMock } from 'core/data/middlewares';

@provider
export default class User extends Provider {
  static middlewares = {
    attachMock
  };

  static mocks = import('mocks/user.json');

  baseURL = 'user/:id';
}
```

## Enabling data mocks

By default, all data mocks are disabled, but you can enable them by simply typing in your browser consoleЖ

```js
// Enables mocks for the User provider
setEnv('mock', {patterns: ['User']});

// Enables mocks for all providers
setEnv('mock', {patterns: ['.*']});
```

These patterns are converted to RegExp objects and matched with provider names (including namespaces).
Configuration settings are stored in the browser local storage.
