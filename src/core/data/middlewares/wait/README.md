# core/data/middlewares/wait

This module provides a middleware to suspend a request until will be resolved the specified value to wait.
The middleware can be used as encoder: the value to wait will be taken from input data (`.wait`),
otherwise, it will be taken from `.meta.wait`.

```js
import Provider, { provider } from 'core/data';
import { wait } from 'core/data/middlewares';

@provider
export default class User extends Provider {
  static encoders = {
    get: [wait]
  };

  baseURL = 'user/:id';
}

(async () => {
  const
    user = new User(),

    // Sleep 500 ms before do the request
    bob = await user.get('bob', {meta: {wait: () => sleep(500)}}).data;

  console.log(bob);

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
})();
```
