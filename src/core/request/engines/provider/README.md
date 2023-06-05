# core/request/engines/provider

This module provides a function that creates a request engine based on the passed data provider.
You can use this kind of provider for simple requests by using `core/request`.

## Synopsis

* The engine can provide response streaming from an internal provider engine.
* The engine can provide events from an internal provider engine.

## Example

```js
import Provider, { provider } from 'core/data';
import createProviderEngine from 'core/request/engines/provider';

@provider
class DataProvider extends Provider {

}

const
  // Also, you can pass a name of the provider or link to the instance
  req = request({engine: createProviderEngine(DataProvider)});

req('/search')
  .then(({response}) => {
    console.log(response.decode());
  });

// You can specify which provider method should be invoked based on the request method
// (by default will be used mapping from the provider properties, like `addMethod` or `updMethod`)

const req2 = request('/search', {
  engine: createProviderEngine(DataProvider, {
    PATCH: 'update'
  })
});
```

Or you can use it with other data providers.

```js
import Provider, { provider } from 'core/data';
import createProviderEngine from 'core/request/engines/provider';

@provider
class BaseProvider extends Provider {
  baseUrl = '/api'
}

@provider
class DataProvider extends Provider {
  static request = BaseProvider.request({
    engine: createProviderEngine(BaseProvider)
  });
}

@provider
class DataProvider2 extends Provider {
  static request = BaseProvider.request({
    engine: createProviderEngine(BaseProvider, {
      // Invoking of `DataProvider2.upd` will call `DataProvider2.add`
      upd: 'add'
    })
  });
}
```

## Why we need this kind of engine?

To resolve an issue, when we have the one server API and two variants of providers,
and we want to cache the response of the "parent" provider. The problem roots are based on the fact that every provider
stores its cache within the separated storage. It's necessary because different providers can have different
decoders (provider stores data in the cache after applying decoders). We can trap in a situation of data collision
while saving the cache: the decoders are not used to generate a hash of the request, so it's possible to meet more than
one set of data with the same hash.

```js
@provider
class BaseProvider extends Provider {
  static request = Provider.request({cacheStrategy: 'forever'});

  baseUrl = '/api'
}

@provider
class DataProvider extends BaseProvider {
  static decoders = DataProviderDecoders;
}

@provider
class DataProvider2 extends BaseProvider {
  static decoders = DataProvider2Decoders;
}

// Will use different cache storages, i.e., the cache doesn't share between instances.
// It happens because every data provider instance has the separated cache storage.
new DataProvider().get();
new DataProvider2().get();
```

If we start to use the parent provider as an engine instead of inheritance, it resolves cache sharing.

```js
@provider
class BaseProvider extends Provider {
  static request = Provider.request({cacheStrategy: 'forever'});

  baseUrl = '/api'
}

@provider
class DataProvider extends Provider {
  static request = BaseProvider.request({
    engine: createProviderEngine(BaseProvider)
  });
}

@provider
class DataProvider2 extends Provider {
  static request = BaseProvider.request({
    engine: createProviderEngine(BaseProvider)
  });
}

// Every data provider stores its cache within the separated cache storage, but also,
// it will be cached by the parent provider.
new DataProvider().get();
new DataProvider2().get();
```

## Composition of parameters

When we create a request, we can also specify many encoders, decoders, and other middlewares to apply.
When we are using another provider as an engine, it can also have its middlewares. How do they work together?

Providers properties during request execution are combined in an obvious way:

- Middlewares and encoders are executed on the current request and, after that - on the engine data provider.
- Decoders - at first on the engine data provide, after that - on the current request.
- URL-s concatenated by a scheme`/$engineProvider/$currentRequest`.

```js
@provider
class DataProvider extends Provider {
  static decoders = {
    get: [parseFromProtobuf]
  }

  baseUrl = '/api'
}

// url = /api/search
const req = request('/api/search', {
  engine: createProviderEngine(DataProvider),
  decoder: normalizeParsedData
});
```
