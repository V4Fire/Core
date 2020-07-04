# core/net

This module provides API to work with a network, such as testing of the network connection, etc.

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
````

## Examples

```js
import * as net from 'core/net';

(async () => {
  await net.isOnline();
})();
```
