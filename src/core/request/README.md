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

Use for await...of statement on a request promise to go through the stream

```js
import request from 'core/request';

const
  res = request('https://foo.com');

for await (const chunk of res) {
  /*
  interface RequestChunk {
    data: Uint8Array | null;
    loaded: number;
    total: number | null;
  } */
  console.log(chunk);
}
```

It's possible to subscribe on a request events

```js
import request from 'core/request';

const
  res = request('https://foo.com');

// emitted when response headers received
res.on('response', (response) => {
  console.log(response);
});

// emitted when the request is complete
res.on('load', (body) => {
  console.log(body);
});

// emitted every time when chunk of data is received
res.on('progress', (chunk) => {
  console.log(chunk);
});

// emitted when the request couldn’t be made, e.g. network down or invalid URL.
res.on('error', (error) => {
  console.log(error);
});
```
