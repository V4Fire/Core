Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v3.88.0 (2022-08-22)

#### :rocket: New Feature

* Added a new method to clone a queue
* Now any queue can be traversed with an iterator

## v3.67.0 (2021-12-01)

#### :boom: Breaking Change

* Renamed `Tasks` to `InnerQueue`
* Renamed `CreateTasks` to `CreateInnerQueue`
* Renamed `QueueOptions.tasksFactory` to `QueueOptions.queueFactory`

## v3.54.1 (2021-07-09)

#### :house: Internal

* Refactored structures to use more effective implementations

## v3.20.0 (2020-07-05)

#### :boom: Breaking Change

* New API and logic `core/queue/merge`

#### :rocket: New Feature

* Added tests
* Added `SimpleWorkerQueue`

#### :bug: Bug Fix

* Fixed bugs
