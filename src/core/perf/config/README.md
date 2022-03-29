# core/perf/config

Bunch of helpers to work with the performance config.

## Perf config

Perf support include, exclude pattern to ignore specific timer events

```js
import { perf as factory } from 'core/perf';

const perf = factory({
  timer: {
    engine: 'console',
    filters: {
      network: {
        include: ['login'],
      }
    }
  }
});

const timer = perf.getTimer('network').namespace('auth');

const timerId = timer.start('login');

// Some computation

timer.finish(timerId);
// Print used time and name of the timer
// Like: network.auth.login took 0.11822200007736683 ms

const newId = timer.start('logout');

// Some computation

timer.finish(newId);
// Won't print anything,
// because `include` doesn't contain logout
```

#### exclude pattern

```js
import { perf as factory } from 'core/perf';

const perf = factory({
  timer: {
    engine: 'console',
    filters: {
      network: {
        exclude: ['login'],
      }
    }
  }
});

const timer = perf.getTimer('network').namespace('auth');

const timerId = timer.start('login');

// Some computation

timer.finish(timerId);
// Won't print anything,
// because `exclude` contain login

const newId = timer.start('logout');

// Some computation

timer.finish(newId);
// Print used time and name of the timer
```
