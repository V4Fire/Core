# build

This folder contains files with Gulp/Webpack/helper scripts to build/validate/etc. the project.

## tsconfig.gulp.js

This task compiles `.tsconfig` from the application root to `tsconfig.json` (it's necessary to compile TS files).

```bash
npx gulp build:tsconfig
```

## tsconfig.js

This file provides a function to compile `.tsconfig` from the application root to `tsconfig.json` (it's necessary to compile TS files).

## build-tsconfig.js

This file immediately executes the function to generate `tsconfig`.

## include.js

This file provides a wrapper over node.js `require` function with adding support of layers, which are declared within the `.pzlrrc` file.

## wrap.gulp.js

This file provides a function to wrap an instance of Gulp with adding support of task overriding.
You should use this function in child projects.

```js
'use strict';

const
  config = require('config');

module.exports = function (gulp = require('gulp')) {
  include('@super/core/gulpfile', __dirname)(gulp);
  global.callGulp(module);
};

module.exports();
```

## build.gulp.js

This file provides a bunch of gulp tasks to build the project.

```bash
# Builds the application as a node.js package with the support of dynamic layers
npx gulp build:server

# Builds the project as a standalone node.js package without the support of dynamic layers
npx gulp build:standalone

# Builds the application as a node.js package with the support of dynamic layers and watches for changes
npx gulp watch:server

# Builds the project as a standalone node.js package without the support of dynamic layers and watches for changes
npx gulp watch:standalone

# Cleans the dist directory of a node.js package with the support of dynamic layers
npx gulp clean:server

# Cleans the dist directory of a node.js standalone package
npx gulp clean:standalone
 * ```

## doc.gulp.js

This file provides a bunch of gulp tasks to generate HTML documentation based on the project.

```bash
npx gulp build:doc
```

## other.gulp.js

This file provides a bunch of helper gulp tasks.

## helpers.js

This file provides a bunch of helper functions to build the project.

## tsnode.js

This files initializes [`ts-node`](https://www.npmjs.com/package/ts-node) package to run tests or execute any ts file in runtime.
