# core/perf

This module provides API to send performance metrics.

## Usage

```js
import perf from 'core/perf';

const timer = perf.getTimer('network').namespace('auth');

// Duration of the `loginUser` request

const
  timerId = timer.start('login'),
  user = await loginUser(credential);

timer.finish(timerId, {email: user.email});

// A reference point in time for the following measurements
const scopedTimer = perf.getScopedTimer('component').namespace('index-page');

// A component was created
scopedTimer.markTimestamp('created');

// A component was mounted
scopedTimer.markTimestamp('mounted');
```

## Configuration

There are two ways to use this module: with a custom configuration or default one.

### Default configuration

The default module export refers to a performance metrics factory configured using the runtime config from `src/config`.
To configure it, define a `perf` property within your config file.

__config__

```js
import { extend } from '@v4fire/core/config';

extend({
  perf: {
    timer: {
      engine: 'console',
      filters: {
        network: ['login'],

        localDB: {
          include: ['load', 'unload']
        },

        components: {
          exclude: ['mount']
        }
      }
    }
  }
})
```

__some-file.ts__

```js
import perf from 'core/perf';

const
  timer = perf.getTimer('network').namespace('auth'),
  timerId = timer.start('login');

// ..

timer.finish(timerId);
```

#### Configuration interface

```typescript
/**
 * General config for performance metrics
 */
export interface PerfConfig {
  /**
   * Performance timers config
   */
  timer: PerfTimerConfig;
}

/**
 * Performance timers config
 */
export interface PerfTimerConfig {
  /**
   * Name of the used engine
   */
  engine: PerfTimerEngineName;

  /**
   * Settings to filter perf events by groups
   */
  filters?: PerfGroupFilters;
}

/**
 * Settings to filter perf events by groups
 */
export type PerfGroupFilters = {
  [K in PerfGroup]?: PerfIncludeFilter | string[] | boolean;
};

/**
 * Include/exclude patterns for perf filters
 */
export interface PerfIncludeFilter {
  /**
   * Include only specific events
   */
  include?: string[];

  /**
   * Exclude only specific events.
   * If `include` and `exclude` are both presented, will be used only include.
   */
  exclude?: string[];
}
```

### Custom configuration

There is a possibility to create a performance metrics factory with a custom configuration. It allows having several
differently configured performance metrics factories at the same time.

This is achieved using the `perf` method, which acquires a new config as the first argument.

```js
import { perf as factory } from 'core/perf';

const perf = factory({
  timer: {
    engine: 'console',
    filters: {
      network: {
        include: ['login']
      }
    }
  }
});

const
  timer = perf.getTimer('network').namespace('auth'),
  timerId = timer.start('login');

// ..

timer.finish(timerId);
```

## Time metrics

Currently, the module supports only the time metrics [core/perf/timer](src_core_perf_timer.html).
