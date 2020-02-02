# build

This folder contains files with Gulp/Webpack/helper scripts to compile an application.

## tsconfig.gulp.js

This task compiles `.tsconfig` from the application root to `tsconfig.json` (it's necessary for compiling of TS files).

```bash
npx gulp build:tsconfig
```

## include.js

This file provides a wrapper over node.js `require` function with adding support of layers, which are declared within the `.pzlrrc` file.

## wrap.gulp.js

This file provides a special function to wrap an instance of Gulp with adding support of task overriding.
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

## docs.gulp.js

This file provides a bunch of gulp tasks to generate a documentation.

```bash
npx gulp build:docs
```

## other.gulp.js

This file provides a bunch of helper gulp tasks.

## helpers.js

This file provides a bunch of helper functions to build an application.
