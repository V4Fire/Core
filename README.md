V4Fire Core Library
===================

This library provides a bunch of isomorphic modules and configurations for working as foundation for another V4 libraries and contents many base classes and structures, such as queue, persistent key-value storage, subclasses for working with promises, etc.

## Prepare for building and developing

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
