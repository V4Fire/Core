# core/perf/timer

Implementation of performance timer module. The module allows calculating and sending time metrics.

## Overview

The module consists of several abstractions:
* engines - actually send metrics data to the specific destination
* a performance timer - has methods to capture specific moment of time and calculate difference between them
* a timers' runner - combines previous abstractions together and makes them work
* a timers' factory - using the runner creates timers

## Factory

The timers' factory is created using `getTimerFactory` function. The function acquires timers' config as the first
argument. It means that there are could be a number of different timers' factories with the different configuration at
the same time.

```js
import { getTimerFactory } from 'core/perf/timer';
const someFactory = getTimerFactory(generalConfig);
const anotherFactory = getTimerFactory(specificConfig);
```

### Methods

Each factory has following methods: `getTimer`, `getScopedTimer`. These methods are entry points for working
with timers. Each of them uses runners inside to create a timer and return it. Also, the methods create a runner
for passed arguments only once, and then use the same runner for the next call with the same arguments.

These methods are called from the main `perf` object, so there is no need to create timers' factory directly.

The following examples imply that a factory has already created and use it only for educational purpose.

### Regular timer

```js
const timer = factory.getTimer('manual');
```

This method returns a regular timer, that starts time measurement from
[the time origin](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#the_time_origin).

Using the same factory in different files and calling `getTimer` method with the same arguments guarantees that inside
it will be used the same instance of the timers' runner. But the method returns different instances of the performance
timer itself.

```js
// file1.ts
const timer = factory.getTimer('components');

// file2.ts
// A different timer from the same runner
const timer = factory.getTimer('components');
```

### Scoped timer

```js
const timer = factory.getScopedTimer('network', 'old-api');
```

This method returns a scoped timer, that starts time measurement from the moment its runner was created.

Since, the next call of the method with the same arguments uses the already created runner, then the time origin
for the new timer will be the same as for the previously created one.

```js
// file1.ts
// A time orign for the internal runner is exact this moment — m0
const timer = factory.getScopedTimer('tools', 'page-helpers');

// file2.ts
// A different timer but its time origin is m0 as well
const timer = factory.getScopedTimer('tools', 'page-helpers');
```
