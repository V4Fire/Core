# core/net

This module provides API to work with a network, such as testing of the network connection, etc.

```js
import * as net from 'core/net';

(async () => {
  console.log(await net.isOnline());
})();
```

## Configuration

To enable online checking you need to add a configuration within your runtime config module (`src/config`).

__config/index.ts__

```js
import { extend } from '@v4fire/core/config';

extend({
  online: {
    // URL to check the online connection
    // (with the "browser.request" engine can be used only image URL-s)
    checkURL: 'https://google.com/favicon.ico',

    // Default options:

    // How often need to check the online connection (ms)
    checkInterval: (5).seconds(),

    // Timeout of a connection checking request
    checkTimeout: (2).seconds(),

    // The maximum number of retries to check the online connection
    retryCount: 3,

    // How often to update the last online connection time
    lastDateSyncInterval: (1).minute(),

    // True, if we need to save a time of the last online connection in the local cache
    persistence: true,

    // How long to store a checking result in the local cache
    cacheTTL: 0.3.second()
  }
});
```

## Events

| EventName | Description                                    | Payload description          | Payload     |
|-----------|------------------------------------------------|------------------------------|-------------|
| `online`  | The network connection has appeared            | -                            | -           |
| `offline` | The network connection has lost                | When was the last connection | `Date`      |
| `status`  | The network connection status has been changed | Connection status            | `NetStatus` |

```js
import * as net from 'core/net';

net.emitter.emitter.on('online', () => {
  console.log("I'm online!");
});

net.emitter.emitter.on('offline', (lastOnlineDate) => {
  console.log(`I have been online at ${lastOnlineDate}`);
});

net.emitter.emitter.on('status', (e) => {
  console.log(`Connection is ${e.status ? 'online' : 'offline'}`);

  if (!e.status) {
    console.log(`I have been online at ${e.lastOnline}`);
  }
});
```

## Engines

The module supports different implementations to check the online connection.
The implementations are placed within `core/net/engines`. By default, it uses a strategy by requesting
some recourses from the internet, like a Google favicon. But you can manually provide an engine to use.

```js
import * as net from 'core/net';

(async () => {
  // Loopback. Always online.
  console.log(await net.isOnline(async () => true));
})();
```
