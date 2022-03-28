# core/pool

This module provides a class to create a pool structure

## Usage

```js
import Pool from 'core/pool';

const pool = new Pool(
  // function return value that will be stored in pool
  () => Object(),

  // start number of objects in the pool
  10
);

// Number of objects in pool that are avalible now
console.log(pool.canTake()); // 10

// if there aren't any avalible objects, return null as a value
const {
  free,
  value
} = pool.take();

// call free will return the value back to pool
free()

// if there aren't any avalible objects, will create one
const {
  destroy,
  value: value1
} = pool.takeOrCreate();

// destroys an object instead of returning it to the pool
destroy()

// returns core/promise/sync (wait until a call of free(value))
pool.takeOrWait()
  .then(({free, value}) => {});
```

## Borrow

You can use one object at multiple places at same the time

```js
import Pool from 'core/pool';

const pool = new Pool(() => Object(), 1);

console.log(pool.canBorrow()); // true

// return null as a value, if pool is empty
const {value} = pool.borrow();

// you can borrow one object mulriple times
const {
  destroy,
  value: value1
} = pool.borrow();

// if the pool is empty, will create one
const {value: value2} = pool.borrowOrCreate();

console.log(value === value1) // true

// destroys an object, if nobody use it
destroy()

// returns core/promise/sync (wait until call of free(value))
pool.takeOrWait()
  .then(({free, value}) => {});
```

## Constructor

Pool constructor can expect additional settings.

```js
let pool = new Pool(
  () => Array(),
  {
    // some hooks
  }
);

let anotherPool = new Pool(
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

console.log(anotherPool.canTake()) // 4

let {value} = pool.take()

console.log(value) // ["lol"]
```

## Settings

Pool's settings

```js
import Pool from 'core/pool';

const pool = new Pool(
  () => Array(1, 2, 3),
  {
    // callbacks that will be invoked on `take` or `takeOrCreate` call
    // expect value that will be returned from `take`, link to pool, and additional params
    onTake: (resource, pool, ...args) => {
      console.log(resource, args)
    },

    // hook that will be called before `free`
    // expect value that are given to `free`, link to pool, and additional params
    onFree: (resource, pool, ...args) => {
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
} = pool.takeOrCreate('hi') // [1, 2, 3] ['hi']

value.push(4)

free('hello', 'world') // [1, 2, 3, 4] ['hello', 'world']

let {
  value: newValue,
  destroy
} = pool.takeOrCreate('hey') // [1, 2, 3] ['hey']

destroy() // destructed: [1, 2, 3, 4]

pool.clear() // cleared
```

## Hash

Pool can separate objects. Objects separated via id. Id is generated with hashFn.

```js
import Pool from 'core/pool';

const pool = new Pool(
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
} = pool.takeOrCreate('hi')

console.log(value) // [1, 2, 3]

free()

console.log(pool.canTake('hi')) // 1

console.log(pool.canTake('hey')) // 0

console.log(pool.canTake()) // 0

console.log(pool.canTake('initial objects')) // 2
```
