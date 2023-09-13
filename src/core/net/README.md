# core/net

This module provides API to work with a network, such as testing of the network connection, etc.

```js
import * as net from 'core/net';

(async () => {
  console.log(await net.isOnline());
})();
```

## Why is this module needed?

At the moment, the module provides a function to check for an internet connection, which replaces the
built-in browser API `navigator.online()` as it doesn't always give the correct result.
The browser API simply checks if your device is connected to the network.
However, it doesn't check for internet access.
Therefore, for a more accurate check, the module uses periodic lightweight requests to check for internet access.

## Where to use it

This module can be useful for organizing the work of your PWA application with offline support.
It allows you to track the availability of the Internet and respond to it by changing the UI.

## Configuration

You need to add a configuration within your runtime config module (`src/config`).

__config__

```js
import { extend } from '@v4fire/core/config';

extend({
  online: {
    // URL to check the online connection
    // (with the "browser.request" engine can be used only image URL-s)
    checkURL: 'https://google.com/favicon.ico',

    // Default options:

    // How often need to check the online connection (ms)
    checkInterval: (30).seconds(),

    // Timeout of a connection checking request
    checkTimeout: (2).seconds(),

    // The maximum number of retries to check the online connection
    retryCount: 3,

    // How often to update the last online connection time
    lastDateSyncInterval: (1).minute(),

    // True, if we need to save a time of the last online connection in the local cache
    persistence: true,

    // How long to store a checking result in the local cache
    cacheTTL: (1).second()
  }
});
```

### About checkURL

TThe module for checking Internet availability sends a lightweight (`HEAD` or `OPTIONS`) request to a specified URL.
It is recommended to use a publicly available URL that receives many requests and is always accessible.
A good example would be the favicon of Google.

If the `checkUrl` is not defined or is null, the Internet availability check will always return true.

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
