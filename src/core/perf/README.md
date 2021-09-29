# core/perf

This module provides the API to send performance metrics.

## Overview

Perf module is the factory for different measurers (or metrics).

There are two ways to use this module: with a custom configuration or default one.

### Default configuration

Object `perf` is performance metrics factory that is configured using runtime config `src/config`. The `perf` field
of the config defines performance settings.

```js
import { perf } from 'core/perf';
```

### Custom configuration

There is an opportunity to create a performance metrics factory with a custom configuration. It allows to have several
differently configured performance metrics factories at the same time.

This is achieved using the `configurePerf` method which acquire a new config as the first argument.

```js
import { configurePerf } from 'core/pref';
const myPerf = configurePerf(myConfig);
```

## Time metrics

Currently, the module supports only the time metrics [core/perf/timer](src_core_perf_timer.html).
