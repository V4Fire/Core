V4Fire Core Library
===================

[![npm version](https://badge.fury.io/js/%40v4fire%2Fcore.svg)](https://badge.fury.io/js/%40v4fire%2Fcore)
[![build status](https://github.com/v4fire/Core/workflows/build/badge.svg?branch=master)](https://github.com/V4Fire/Core/actions?query=workflow%3Abuild)

[![Coverage Status](https://coveralls.io/repos/github/V4Fire/Core/badge.svg)](https://coveralls.io/github/V4Fire/Core)

This library provides a bunch of isomorphic modules and configurations to work as a foundation for another V4 libraries and contents many base classes and structures, such as queue, persistent key-value storage, subclasses to work with promises, etc.

[GitHub](https://github.com/V4Fire/Core)

## Using as a node.js library

```js
// Register Prelude in the top level of your project
require('@v4fire/core');

const {watch} = require('@v4fire/core/lib/core/object/watch').default;

const {proxy} = watch({a: 1}, console.log);

proxy.a++;
```

Also, you can require modules by using `import`.

```js
// Register Prelude in the top level of your project
import '@v4fire/core';

import watch from '@v4fire/core/lib/core/object/watch/index.js';

const {proxy} = watch({a: 1}, console.log);

proxy.a++;
```

## Prepare to build and develop

At first, you should install dependencies using `npm`:

```bash
npm ci
```

After this you should compile a configuration for TypeScript:

```bash
npx gulp build:tsconfig
```

## Configuration and building

All build config files are placed within the `config` folder. File names of config files are tied with a value of the `NODE_ENV` environment variable.
Build scripts, such as Gulp or Webpack, are contained within the `build` folder.

To build your project, you should run the following script:

```bash
npm run build
```

## Run tests

Before running tests, your project should be built. There are several scripts that run tests:

```bash
// runs tests that check typing
npm run test:typescript

// runs tests that check code quality
npm run test:eslint

// runs both previous tests
npm run test:linters

// runs unit tests
npm run test:jasmine

// runs all tests
npm test
```

### Unit tests developing

During test development, it's convenient when the project is rebuilt automatically after changes in code.
For this purpose, you can use the following script:

```bash
npm run dev
```

Then you can run tests that you are currently developing:

```bash
npx jasmine ./dist/server/path/to/*.spec.js
```
