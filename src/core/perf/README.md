# core/perf

This module provides API to send performance metrics.

## Usage

```js
import perf from 'core/perf';

const timer = perf.getTimer('network').namespace('auth');

// the duration of the `loginUser` request
const timerId = timer.start('login');
const user = await loginUser(credential);
timer.finish(timerId, {email: user.email});

// the reference point in time for following measurements
const scopedTimer = perf.getScopedTimer('component').namespace('index-page');

// a component was created
scopedTimer.markTimestamp('created');

// a component was mounted
scopedTimer.markTimestamp('mounted');
```

## Overview

Perf module is a factory for different measures (or metrics).

There are two ways to use this module: with a custom configuration or default one.

### Default configuration

The default export from the module refers to a performance metrics factory, configured using the runtime config
from `src/config`. The `perf` config field of the config defines performance settings.

```js
import perf from 'core/perf';
```

### Custom configuration

There is an opportunity to create a performance metrics factory with a custom configuration. It allows having several
differently configured performance metrics factories at the same time.

This is achieved using the `perf` method, which acquires a new config as the first argument.

```js
import { perf } from 'core/perf';

const myPerf = perf(myConfig);
```

## Time metrics

Currently, the module supports only the time metrics [core/perf/timer](src_core_perf_timer.html).
