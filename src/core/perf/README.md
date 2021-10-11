# core/perf

This module provides API to send performance metrics.

## Overview

Perf module is a factory for different measures (or metrics).

There are two ways to use this module: with a custom configuration or default one.

### Default configuration

Object `perf` is a performance metrics factory configured using the runtime config from `src/config`.
The `perf` config field of the config defines performance settings.

```js
import { perf } from 'core/perf';
```

### Custom configuration

There is an opportunity to create a performance metrics factory with a custom configuration. It allows having several
differently configured performance metrics factories at the same time.

This is achieved using the `configurePerf` method, which acquires a new config as the first argument.

```js
import { configurePerf } from 'core/perf';

const myPerf = configurePerf(myConfig);
```

## Time metrics

Currently, the module supports only the time metrics [core/perf/timer](src_core_perf_timer.html).
