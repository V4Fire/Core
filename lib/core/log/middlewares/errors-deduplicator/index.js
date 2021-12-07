"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorsDeduplicatorMiddleware = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/log/middlewares/extractor/README.md]]
 * @packageDocumentation
 */

/**
 * Middleware to omit duplicated errors
 */
class ErrorsDeduplicatorMiddleware {
  /**
   * Errors that have already been occurred
   */
  errorsDoubles = new WeakSet();
  /** @inheritDoc */

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
  /**
   * Returns true if the passed event has an error that's already occurred
   * @param event - log event from a pipeline
   */


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