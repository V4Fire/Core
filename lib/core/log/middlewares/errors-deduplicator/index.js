"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorsDeduplicatorMiddleware = void 0;
class ErrorsDeduplicatorMiddleware {
  errorsDoubles = new WeakSet();
  exec(events, next) {
    if (Object.isArray(events)) {
      events = events.filter(event => this.omitEvent(event));
      if (events.length > 0) {
        next(events);
      }
    } else if (!this.omitEvent(events)) {
      next(events);
    }
  }
  omitEvent(event) {
    if (event.error != null) {
      if (this.errorsDoubles.has(event.error)) {
        return true;
      }
      this.errorsDoubles.add(event.error);
      return false;
    }
    return false;
  }
}
exports.ErrorsDeduplicatorMiddleware = ErrorsDeduplicatorMiddleware;