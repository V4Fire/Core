# core/perf/timer/engines

This module contains the engines that send time metrics to a target destination.

## Overview

Each engine has to implement the `PerfTimerEngine` interface. It means that an engine should have the following methods:

* `sendDelta` - to send metrics data
* `getTimestampFromTimeOrigin` - returns a timestamp from the application start. In the simple example, it could be
  `performance.now()`, but the engine can define the precision and the moment the application starts.
