# core/lazy

This module provides a function to create a lazy structure based on the provided function or class.
The created structure is a function with the pre-defined methods and properties from the passed scheme and/or class prototype.
All property or method actions will be intercepted and accumulated in a queue. After invoking the result function,
all accumulated actions will be executed.

## Usage

### With a function that returns an object

```js
import { makeLazy } from 'core/lazy';

function createUser(name, age) {
  return {
    name,
    age,

    showInfo() {
      console.log(`Name: ${this.name}; Age: ${this.age}`);
    }
  };
}

const lazyUser = makeLazy(
  createUser,

  // Declaring a scheme with the result of the original function invoking
  {
    // A string property with the default value
    name: '',

    // A number property with the default value
    age: 0,

    // A method
    showInfo: Function
  }
);

// Nothing happens at all
lazyUser.age = 45;
lazyUser.showInfo();

// Invoking the lazy function and passing necessary arguments.
// After invoking we can see in a console the result of calling `showInfo`:
// `Name: Bob; Age: 45`
const user = lazyUser('Bob', 10);
```

### With a class

```js
import { makeLazy } from 'core/lazy';

class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;

    this.config = {
      errorHandler() {
        console.log('Boom!');
      }
    };
  }

  showInfo() {
    console.log(`Name: ${this.name}; Age: ${this.age}`);
  }
}

const LazyUser = makeLazy(
  User,

  // Declaring only properties.
  // All methods are taken automatically from the class prototype.
  {
    config: {
      attr: {},
      errorHandler: Function
    }
  }
);

// Nothing happens at all
LazyUser.showInfo();
LazyUser.config.attr = 'value';
LazyUser.config.errorHandler();

// Creating an instance of the lazy class and passing necessary arguments to its constructor.
// After invoking we can see in a console the results of calling `showInfo` and `config.errorHandler()`:
// `Name: Bob; Age: 23`
// `Boom!`
const user = new LazyUser('Bob', 23);

// Because of `LazyUser.config.attr = 'value'`
console.log(user.config.attr === 'value');

// After invoking we can see in a console the results of `showInfo` and `config.errorHandler()`:
// `Name: Fred; Age: 56`
// `Boom!`
const user2 = new LazyUser('Fred', 56);
```

## Action hooks

There is possibility to provide hook handlers on of some structure actions,
like getting or setting a property value or method invoking. These handlers take an array of the already created `Lazy` instances.
Other arguments depend on the hook type.

```js
import { makeLazy } from 'core/lazy';

class RenderEngine {
  component(name, opts) {
    if (opts == null) {
      return /* Component declaration */;
    }

    return /* Create a component */;
  }
}

const LazyRenderEngine = makeLazy(
  RenderEngine,

  {
    config: {
      attr: {},
      errorHandler: Function
    }
  },

  {
    get: {
      'config.attrs'(contexts) {
        return contexts.at(-1).config.attrs;
      }
    },

    set: {
      'config.attrs'(contexts, value) {
        contexts.forEach((ctx) => {
          ctx.config.attrs = value;
        });
      }
    },

    call: {
      component(contexts, ...args) {
        if (args.length > 1) {
          contexts.forEach((ctx) => {
            ctx.component(...args);
          });

          return;
        }

        return contexts.at(-1).component(...args);
      }
    }
  }
);

const
  engine1 = new LazyRenderEngine(),
  engine2 = new LazyRenderEngine();

// These actions will be provided to the already created instances,
// because we specify hook handlers with this logic

// Will invoke a handler `set.config.attrs`
LazyRenderEngine.config.attrs = 'value';

// Will invoke a handler `get.config.attrs`
console.log(LazyRenderEngine.config.attrs);

// Will invoke a handler `call.component`
LazyRenderEngine.component('newAwesomeComponent', {
  props: { /* ... */ },
  render: () => { /* ... */ }
});
```

## Dispose lazy object

To ensure an object is no longer lazy, you must call the `disposeLazy` function.
This function requires a context as its input, which, upon invocation, will cease to be lazy.

```js
import { makeLazy, disposeLazy } from 'core/lazy';

class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;

    this.config = {
      errorHandler() {
        console.log('Boom!');
      }
    };
  }

  showInfo() {
    console.log(`Name: ${this.name}; Age: ${this.age}`);
  }

  destroy() {
    // ...
  }
}

const LazyUser = makeLazy(
  User,

  // Declaring only properties.
  // All methods are taken automatically from the class prototype.
  {
    config: {
      attr: {},
      errorHandler: Function
    }
  }
);

// User is now lazy and stored into lazy contexts.
const user = new LazyUser('Bob', 23);

// ...

// User is no longer needed.
user.destroy();
disposeLazy(user);
```

It's crucial to understand that the lazy module maintains a strong reference to the context it creates.
That is, when the lazy object's constructor is called, its context is preserved inside the makeLazy function.
To properly clear this and prevent memory leaks, `disposeLazy` must be invoked.
Therefore, it is imperative to remember to clean up the lazy state.
