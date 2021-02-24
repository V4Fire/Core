# core/request/engines/provider

This module provides a function which creates an engine based on a data provider.
It can be used with simple request:

```js
import createProviderEngine from 'core/request';

@provider
class DataProvider extends Provider {

}

const
  req = request({engine: createProviderEngine('dataProvider')});
// or
// const
//  req = request({engine: createProviderEngine(DataProvider)});
// or
// const
//  providerInstance = new DataProvider(),
//  req = request({engine: createProviderEngine(providerInstance)});

req('/search')
  .then(({response}) => {
    console.log(response.decode());
  });
```

Or it can be used for the request engine of another data provider:

```js
@provider
class BaseProvider extends Provider {
  baseUrl = '/api'
}

@provider
class DataProvider extends Provider {
  static request = BaseProvider.request({
    engine: createProviderEngine(BaseProvider)
  })

  baseUrl = '/data'
}
```
> For better compatibility please use request method of base provider.

Providers properties during request execution are combined in an obvious way:
- middlewares and encoders are executed on the current data provider and after that - on the base data provider.
- decoders - at first on the base data provider, in a secondary capacity - on current data provider.
- urls concatenated as `/baseDataProviderUrl/currentDataProviderUrl`

```js
(new DataProvider()).get() // url = /api/data
```

> Please remember that every data provider instance creates its own cache.

Also, you can pass object with request methods mapping:

```js
const req = request({
  engine: createProviderEngine('dataProvider', {
    'POST': 'PUT',
    'PUT': 'POST'
  })
});
```

And now for `method='POST'` will be executed `PUT` request:

```js
req('/data', {
  method: 'POST'
}); // PUT request
```

Same mechanic for the data providers chain:

```js
@provider
class DataProvider extends Provider {
  static request = BaseProvider.request({
    engine: createProviderEngine(BaseProvider, {
      peek: 'upd'
    })
  })
}

(new DataProvider()).peek() // will be executed 'upd' method of BaseProvider
```
