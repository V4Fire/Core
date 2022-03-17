# core/pull

This module provides a class to create a pull structure

## Usage

```js
import Pull from 'core/pull';

const pull = new Pull(
  // function return value that will be stored in pull
  () => Object(),

  // start number of objects in the pull
  10
);

// Number of objects in pull that are avalible now
console.log(pull.canTake()); // 10

// if there aren't any avalible objects, throw error
const {
  free,
  value
} = pull.take();

// call free will return the value back to pull
free(value)

// if there aren't any avalible objects, will create one
const {
  destroy,
  value: value1
} = pull.takeOrCreate();

// destroys an object instead of returning it to the pull
destroy(value1)

// returns core/promise/sync (wait until a call of free(value))
pull.takeOrWait()
  .then(({free, value}) => {});
```

## Borrow

You can use one object at multiple places at same the time

```js
import Pull from 'core/pull';

const pull = new Pull(() => Object(), 1);

console.log(pull.canBorrow()); // true

// throw error, if pull is empty
const {
  free,
  value
} = pull.borrow();

// you can borrow one object mulriple times
const {
  destroy,
  value: value1
} = pull.borrow();

// if the pull is empty, will create one
const {value: value2} = pull.borrowOrCreate();

console.log(value === value1) // true

// destroys an object, if nobody use it
destroy(value1)

// returns core/promise/sync (wait until call of free(value))
pull.takeOrWait()
  .then(({free, value}) => {});
```

## Constructor

Pull constructor can expect additional settings.

```js
let pull = new Pull(
  () => Array(),
  {
    // some hooks
  }
);

let anotherPull = new Pull(
  (firstItem) => [firstItem],

  // how many objects will be created immediately
  4,

  // params that will be passes to the object factory
  // only for objects that will be created immediately
  ['lol'],
  {
    // some hooks
  }
);

console.log(anotherPull.canTake()) // 4

let {value} = pull.take()

console.log(value) // ["lol"]
```

## Settings

Pull's settings

```js
import Pull from 'core/pull';

const pull = new Pull(
  () => Array(1, 2, 3),
  {
    // callbacks that will be invoked on `take` or `takeOrCreate` call
    // expect value that will be returned from `take`, link to pull, and additional params
    onTake: (resource, pull, ...args) => {
      console.log(resource, args)
    },

    // hook that will be called before `free`
    // expect value that are given to `free`, link to pull, and additional params
    onFree: (resource, pull, ...args) => {
      console.log(resource, args)
    },

    // function that destroy given object
    destructor: (value) => {
      console.log("destructed: ", value)
    },

    // hook that will be called before clear
    onClear: () => {
      console.log("cleared")
    }
  }
);

let {
  value,
  free
} = pull.takeOrCreate('hi') // [1, 2, 3] ['hi']

value.push(4)

free(value, 'hello', 'world') // [1, 2, 3, 4] ['hello', 'world']

let {
  value: newValue,
  destroy
} = pull.takeOrCreate('hey') // [1, 2, 3] ['hey']

destroy(newValue) // destructed: [1, 2, 3, 4]

pull.clear() // cleared
```

## Hash

Pull can separate objects. Objects separated via id. Id is generated with hashFn.

```js
import Pull from 'core/pull';

const pull = new Pull(
  () => Array(1, 2, 3),
  2,
  ['initial objects'], // createOpts
  {
    // take args that are given to function and convert them to string
    // arg - params passed to `takeOrCreate`, `borrowOrCreate`, `createOpts`
    hashFn: (...args) => JSON.stringify(args)
  }
);

let {
  value,
  free
} = pull.takeOrCreate('hi')

console.log(value) // [1, 2, 3]

free(value)

console.log(pull.canTake('hi')) // 1

console.log(pull.canTake('hey')) // 0

console.log(pull.canTake()) // 0

console.log(pull.canTake('initial objects')) // 2
```
