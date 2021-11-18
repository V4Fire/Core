# core/lazy

This module provides a function to create a lazy structure based on the provided function or class.
The created structure is a function, but it has all properties declared in a scheme that invokes the module function.
All property/method actions will intercept and accumulate in a queue. After invoking the result function, all actions will execute.

## Usage

### With a function that returns an object

```js
import makeLazy from 'core/lazy';

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

  // Declare a scheme with a result of the original function invoking
  {
    // '' is a default value
    name: '',

    // 0 is a default value
    age: 0,

    // This is a method
    showInfo: Function
  }
);

// Nothing happens at all
lazyUser.age = 45;
lazyUser.showInfo();

// Invoke the lazy function and pass necessary arguments.
// After invoking we can see in a console the result of `showInfo`:
// `Name: Bob; Age: 45`
const user = lazyUser('Bob', 10);
```

### With a class

```js
import makeLazy from 'core/lazy';

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

  // Declare only properties, all methods automatically are taken from a prototype
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

// Сreate an instance of the lazy class and pass necessary arguments to its constructor.
// After invoking we can see in a console the results of `showInfo` and `config.errorHandler()`:
// `Name: Bob; Age: 23`
// `Boom!`
const user = new LazyUser('Bob', 23);

// Because of `LazyUser.config.attr = 'value'`
console.log(user.config.attr === 'value');
```
