# core/request

This module provides API to request/submit data using AJAX and similar techniques.

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
