# core/analytics

This module provides API to work with analytic services.
Each of the analytic services should define its own engine within the `core/analytics/engines` folder.

Notice, there is no implementation for any analytic services.
You have to create it by yourself.

## Creating a new analytics engine

Create a new file within the `engines` folder and expose it from the `index` file.
Let's create a simple engine for Google Analytics.

__core/analytics/engines/ga.ts__

```typescript
export default function sendEvent(event: string, hint?: string, extra?: [...string, Dictionary?]) {
  ga(event, hint, ...extra);
};
```

__core/analytics/engines/index.ts__

```typescript
export { default } from 'core/analytics/engines/ga';
```
