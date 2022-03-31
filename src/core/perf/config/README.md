# core/perf/config

This module provides a bunch of helpers to configure the `core/perf` module.

## Configuration interface

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
