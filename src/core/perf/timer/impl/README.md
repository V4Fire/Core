# core/perf/timer/impl

This module contains a runner implementation for performance timers.

## Overview

The runner is the actual thing that measures the difference between time moments.
It can create performance timers that are just proxies that execute measurement methods of the runner they created.
The main responsibility of timers is to store the whole namespace of current metrics to make them easy to use.

## Runner

### Constructor

The `PerfTimersRunner` class has several parameters in its constructor:

* `engine` - the most important argument is `PerfTimerEngine` instance. It is **required**.
* `filter` - predicate to filter metrics. If it returns `false`, the metrics won't be sent anywhere.
* `keepTImeOffset` - the runner becomes a scoped one. All new timestamps measure from the moment the runner was created.

A simple runner:

```js
import { PerfTimersRunner } from 'core/perf/timer/impl'
import engines from 'core/perf/timer/engines';

const runner = new PerfTimersRunner(engines.console);
```

A scoped runner:

```js
import { PerfTimersRunner } from 'core/perf/timer/impl'
import engines from 'core/perf/timer/engines';

const scopedRunner = new PerfTimersRunner(engines.console, undefined, true);
```

A runner with filtering:

```js
import { PerfTimersRunner } from 'core/perf/timer/impl'
import engines from 'core/perf/timer/engines';

const filterPredicate = (ns: string) => ns.startsWith('network');

// Only metrics which namespace starts with 'network' will be printed in the console
const runner = new PerfTimersRunner(engines.console, filterPredicate);
```

### Methods

The class has only one public method `createTimer` that returns an instance of performance timer.

```js
import { PerfTimersRunner } from 'core/perf/timer/impl'
import engines from 'core/perf/timer/engines';

const runner = new PerfTimersRunner(engines.console);
const timer = runner.createTimer('network');
```

Some protected methods are used by performance timer instances.

## Timer

A performance timer is used to make time measurements.

After its creation, the timer has only a group name. The timer stores the whole namespace inside.
When new metrics are created, the timer's namespace prepends to metrics name, forming the full name of the metrics.

```js
import { PerfTimersRunner } from 'core/perf/timer/impl'
import engines from 'core/perf/timer/engines';

const runner = new PerfTimersRunner(engines.console);

// Timer's namespace at this point is "network"
const timer = runner.createTimer('network');

// Here time metrics are created, and its full name is "network.auth"
const timerId = timer.start('auth');
```

### Methods

The performance timer has several methods to measure and one method to define a namespace.

#### Namespace

Returns a new performance timer instance with the updated namespace.

```js
import { PerfTimersRunner } from 'core/perf/timer/impl'
import engines from 'core/perf/timer/engines';

const
  runner = new PerfTimersRunner(engines.console),
  timer = runner.createTimer('network');

// The timer namespace is "network.auth"
const timerNs = timer.namespace('auth');

// The full metrics name is "network.auth.login"
const timerId = timerNs.start('login');
```

#### Local measurement

Two methods `start` and `finish` are designed for local measurements.
Method `start` marks the beginning of measurement and returns a timer identifier to finish the measurement.

The advantage of this approach is that there could be a number of concurrent measurements with the same name,
and none of them will affect each other since every timer identifier is unique.

```js
import { PerfTimersRunner } from 'core/perf/timer/impl'
import engines from 'core/perf/timer/engines';

const
  runner = new PerfTimersRunner(engines.console),
  timer = runner.createTimer('network').namespace('auth');

const timerId = timer.start('login');

await login(credentials);

timer.finish(timerId);
```

The `finish` method also acquires some additional information for the metrics as a second parameter.
This kind of measurement is not affected by the runner's time origin because it measures the time difference between two moments.

#### Time marks

Also, there is a possibility to measure time from the runner's time origin with `markTimestamp` method.

```js
import { PerfTimersRunner } from 'core/perf/timer/impl'
import engines from 'core/perf/timer/engines';

const
  runner = new PerfTimersRunner(engines.console),
  timer = runner.createTimer('components').namespace('button');

// Some code
timer.markTimestamp('created');

// Another code
timer.markTimestamp('mounted');
```

This method measures time from the runner's time origin to the moment the method was called.
It is possible to pass additional data as the second argument to the method.
