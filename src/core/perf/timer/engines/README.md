# core/perf/timer/engines

This module contains the engines that send time metrics to a target destination.

## Overview

Each engine has to implement the `PerfTimerEngine` interface. It means that an engine should have following methods:
* `sendDelta` - for sending metrics data
* `getTimestampFromTimeOrigin` - returns a timestamp from the application start. In the simple example it could be
`performance.now()`, but the engine can define by itself the precision, and the moment of the application start.
