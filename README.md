V4Fire Core Library
===================

[![npm version](https://badge.fury.io/js/%40v4fire%2Fcore.svg)](https://badge.fury.io/js/%40v4fire%2Fcore)
[![build status](https://github.com/v4fire/Core/workflows/build/badge.svg?branch=master)](https://github.com/V4Fire/Core/actions?query=workflow%3Abuild)

[![NPM dependencies](http://img.shields.io/david/v4fire/core.svg?style=flat)](https://david-dm.org/v4fire/core)
[![NPM optionalDependencies](http://img.shields.io/david/optional/v4fire/core.svg?style=flat)](https://david-dm.org/v4fire/core?type=optional)
[![NPM devDependencies](http://img.shields.io/david/dev/v4fire/core.svg?style=flat)](https://david-dm.org/v4fire/core?type=dev)

[![Coverage Status](http://img.shields.io/coveralls/V4Fire/Core.svg?style=flat)](https://coveralls.io/r/V4Fire/Core?branch=issues/100)

This library provides a bunch of isomorphic modules and configurations to work as a foundation for another V4 libraries and contents many base classes and structures, such as queue, persistent key-value storage, subclasses to work with promises, etc.

[GitHub](https://github.com/V4Fire/Core)

## Prepare to build and develop

At first you should install dependencies using `npm`:

```bash
npm ci
```

After this you should compile a configuration for TypeScript:

```bash
npx gulp build:tsconfig
```

## Configuration and building

All build config files are contain within the `config` folder. File names of config files are tied with a value of the `NODE_ENV` environment variable.
Build scripts, such as Gulp or Webpack, are contain within the `build` folder.
