# core/request/engines/provider/composition

Этот модуль предоставляет движок для провайдер который позволяет реализовать композицию провайдеров.

## Example

Imagine a situation where we have 2 providers and we want to create a single provider based on them,
for some reason it is more convenient for us.
To achieve this, we need to use a function that will create a composition engine.
This function takes an array with a description of the requests that the engine needs to make.
To make a request, the engine will call the request function for each of the request description objects.
These functions will run in parallel.
The results obtained will be stored in the `provider1Response` and `provider2Response` fields respectively.

```typescript
import { providerCompositionEngine } from 'core/request/engines/provider';

@provider
class Provider1 extends Provider {
  override baseURL: string = 'http://localhost:5000/json/1';
}

@provider
class Provider2 extends Provider {
  override baseURL: string = 'http://localhost:5000/json/2';
}

@provider
class ComposedProvider extends Provider {
  static override request: Provider['request'] = Provider.request({
    engine: providerCompositionEngine([
      {
        request: (opts, params, {providerWrapper}) => providerWrapper(new Provider1()).get(),
        as: 'provider1Response'
      },
      {
        request: (opts, params, {providerWrapper}) => providerWrapper(new Provider2()).get(),
        as: 'provider2Response'
      }
    ])
  });
}

const
  dp = new ComposedProvider(),
  data = await dp.get().data;
```

You are not limited to describing only 2 request objects here; there can be as many as you need.
In addition, within the request function, you can implement more complex chains where one request depends on another.

```typescript
import { providerCompositionEngine } from 'core/request/engines/provider';

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
class ComposedProvider extends Provider {
  static override request: Provider['request'] = Provider.request({
    engine: providerCompositionEngine([
      {
        request: async (opts, params, {providerWrapper}) => {
          const
            result = {},
            data = await providerWrapper(new Provider1()).get().data;

          result.firstData = data;

          if (data.needRequest) {
            const secondData = await providerWrapper(new Provider3()).get().data;
            result.secondData = data;
          }

          return result;
        },
        as: 'provider1Response'
      },
      {
        request: (opts, params, {providerWrapper}) => providerWrapper(new Provider2()).get(),
        as: 'provider2Response'
      }
    ])
  });
}

const
  dp = new ComposedProvider(),
  data = await dp.get().data;
```
