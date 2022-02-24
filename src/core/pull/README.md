# core/pull
### Usage
```js
import Pull from 'core/pull';

const pull = new Pull(
  // function return value that are stored in pull
  ()=>Object(),

  // start number of objects in pull
  10
);

// pull size
console.log(pull.size);

// max size of pull if exist (look constructor params)
console.log(pull.maxSize);

// Number of objects in pull that are avalible now
console.log(pull.available);

// if there zero object throw error
// call free will return the value back to pull
const {free, value} = pull.take();

// if there aren't any avalible objects, will create one
const {free, value} = pull.takeOrCreate();

// return core/promise/sync (wait until something call free(value)
pull.takeOrWait().then(({free, value}) => {});
```

Pull's constructor can except additional settings

```js
import Pull from 'core/pull';

const pull = new Pull(
  () => {},
  10,

  {
    // After Pull's size equal 20
    // takeOrCreate will throw error if there aren't avalible objects
    maxSize: 20,

    // Hook that will be called before take, takeOrCreate
    // Expect value that will be returned from take, link to pull, and additional params
    onTake: (resource, pull, args) => {},

    // Hook that will be called before free
    // Expect value that are given to free, link to pull, and additional params
    onFree: (resource, pull, args) => {}
  }
);
```
