# core/data/middlewares/attach-status

This module provides a decoder middleware to attach a response status to the response data.

```js
import Provider, { provider } from 'core/data';
import { attachStatus } from 'core/data/middlewares';

@provider
export default class User extends Provider {
  static decoders = {
    get: [attachStatus]
  };

  baseURL = 'user/:id';
}

(async () => {
  const
    user = new User(),
    bob = await user.get('bob').data;

  // Response status code (number)
  console.log(bob.status);

  // User response data
  console.log(bob.data);
})();
```
