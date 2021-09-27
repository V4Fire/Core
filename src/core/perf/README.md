# core/perf

This module provides the API to send performance metrics.

## Overview

Perf module is the factory for different measurers (or metrics).

## Time metrics

Currently, the module supports only the time metrics. There are several ways these metrics can be used.

### Regular timer

The simplest way is to get regular timer and calculate time, that some method takes to execute:

```js
import { perf } from 'core/perf';

const timer = perf.getTimer('manual');
const timerId = timer.start('loading');
await loadSomething();
timer.finish(timerId);
```

### Scoped timer

Another example shows using of scoped timer:

```js
import { perf } from 'core/perf';

const timer = perf.getScopedTimer('components', 'p-main-page');
// <some code>
timer.markTimestamp('init');
```

A scoped timer remembers the time it was called the first time and measures all timestamp starting from this moment.
On the other hand, regular timer measures all timestamps starting from
[the time origin](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#the_time_origin).
