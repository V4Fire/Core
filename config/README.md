# config

This folder contains config files to compile an application and run a server. File names are tied with a value of the `NODE_ENV` environment variable.

## Inheritance

The config API supports inheritance of configs from another project.

```js
'use strict';

const
  config = require('@v4fire/core/config/default');

module.exports = config.createConfig({dirs: [__dirname, 'client']}, {
  __proto__: config,

 foo: {
   bar: 'bla'
 }
});
```
