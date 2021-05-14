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

```js
export default {
  online: {
    // URL to check online connection
    // (with the "browser.request" engine can be used only image URL-s)
    checkURL: 'https://google.com/favicon.ico',

    // Default options:

    // How often need to check online connection (ms)
    checkInterval: (5).seconds(),

    // The timeout of downloading the check URL
    checkTimeout: (2).seconds(),

    // The number of retries of downloading the check URL
    retryCount: 3,

    // How long to store the result of checking in the local cache
    cacheTTL: 0.3.second(),

    // True, if we need to save the time of the last online connection in a local storage
    persistence: true,

    // How often to update the time of the last online connection
    lastDateSyncInterval: (1).minute()
  }
}
```

## Engines

The module supports different implementations to check the online connection.
The implementations are placed within `core/net/engines`. By default, it uses a strategy by requesting
some recourse from the internet, like a Google favicon. But you can manually provide an engine to use.

```js
import * as net from 'core/net';

(async () => {
  // Loopback. Always online.
  console.log(await net.isOnline(async () => true));
})();
```
