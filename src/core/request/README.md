# core/request

This module provides an API for executing asynchronous remote request using AJAX and similar techniques.

```js
import request from 'core/request';

request('https://foo.com', {
  method: 'POST',
  body: {
    bla: 'bar'
  }
}).then(({response}) => {
  console.log(response.decode(), response.status);
})
```
