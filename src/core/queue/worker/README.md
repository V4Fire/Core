# core/queue/worker

This module provides an abstract class for a [[WorkerQueue]] data structure.
The submodules contain different implementations of that class.

## Implementations:

* [SimpleWorkerQueue](src_core_queue_worker_simple.html)

* [MergeWorkerQueue](src_core_queue_worker_merge.html)

## API

### Constructor

#### Providing a task executor

The structure constructor expects a function that will be invoked on each processed task.
The function can return a promise (it will be awaited).

```js
import WorkerQueue from 'core/queue/worker/simple';

const queue = new WorkerQueue((task) => {
  console.log(task);
});

queue.push({a: 1});
queue.push({a: 2});
```

#### Queue options

##### [concurrency = `1`]

The maximum number of concurrent workers.

```js
import WorkerQueue from 'core/queue/worker/simple';

const queue = new WorkerQueue((task) => {
  console.log(task);
}, {concurrency: 2});

queue.push({a: 1});

console.log(queue.length); // 0

queue.push({a: 2});

console.log(queue.length); // 0

queue.push({a: 3});

console.log(queue.length); // 1

queue.push({a: 4});

console.log(queue.length); // 2
```

##### [refreshInterval]

How often to refresh task statuses, i.e., the next butch of tasks will be executed after the specified interval
(by default, on the next process tick).

### Properties

#### concurrency

The maximum number of concurrent workers.

#### refreshInterval

How often to refresh task statuses, i.e., the next butch of tasks will be executed after the specified interval
(by default, on the next process tick).

#### activeWorkers

Number of active workers (in process).
