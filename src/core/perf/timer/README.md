# core/perf/timer

Implementation of performance timer module. The module allows calculating and sending time metrics.

## Overview

The module consists of several abstractions:
* engines - actually sends metrics data to specific destination
* a timer - has methods to capture specific moment of time and calculate difference between them
* a runner - combines previous abstractions together and makes them work

Also, there are factory methods that help to create runners: `getTimer`, `getScopedTimer`.

## Factory methods

These methods are entry points to the timer module. Each of them uses runners inside to create a timer and return it.
Also, the methods create the runner for passed arguments only once, and then use the same runner for the next call with
the same arguments.

These exact methods are called from the main `perf` object, so there is no need to import them directly.

Following examples import the methods only for educational purpose.

### Regular timer

```js
import { getTimer } from 'core/perf/timer'
const timer = getTimer('manual');
```

This method returns a regular timer, that starts time measurement from
[the time origin](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#the_time_origin).

The next call of the method in another file will use the same runner inside. But it will be another instance of the
timer itself.

```js
// file1.ts
import { getTimer } from 'core/perf/timer';
const timer = getTimer('components');

// file2.ts
import { getTimer } from 'core/perf/timer';
// A different timer from the same runner
const timer = getTimer('components');
```

### Scoped timer

```js
import { getScopedTimer } from 'core/perf/timer'
const timer = getScopedTimer('network', 'old-api');
```

This method returns a scoped timer, that starts time measurement from the moment its runner was created.

Since, the next call of the method with the same arguments uses the already created runner, then an origin of the time
for the new timer will be the same as for the previously created one.

```js
// file1.ts
import { getScopedTimer } from 'core/perf/timer';
// A time orign for the internal runner is exact this moment — m0
const timer = getScopedTimer('tools', 'page-helpers');

// file2.ts
import { getScopedTimer } from 'core/perf/timer';
// A different timer but its time origin is m0 as well
const timer = getScopedTimer('tools', 'page-helpers');
```
