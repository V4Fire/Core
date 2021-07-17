# core/data/middlewares/wait

This module provides a middleware to freeze a request until will be resolved the specified value to wait.
The middleware can be used as encoder: the value to wait will be taken from input data (`.wait`),
otherwise, it will be taken from `.meta.wait`.

*models/my-provider*

```typescript
import Provider, { provider, EncodersMap } from 'core/data';
import { wait } from 'core/data/middlewares';

@provider
export default class MyProvider extends Provider {
  encoders: EncodersMap = [wait];
}
```

*base/b-example*

```typescript
import 'models/my-provider';
import iData, { system, RequestParams } from 'super/i-data/i-data';

export default class bExample extends iData {
  override dataProvider: string = 'MyProvider';

  @system((o) => o.sync.object('get', [['wait', 'canLoadData']]))
  override requestParams!: RequestParams;

  async canLoadData(): Promise<boolean> {
    await this.async.sleep((3).seconds());
    return true;
  }
}
```
