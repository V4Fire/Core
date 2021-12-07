"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogPipeline = void 0;

var _base = require("../../../core/log/base");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
class LogPipeline {
  middlewareIndex = 0;

  constructor(engine, middlewares, minLevel) {
    this.engine = engine;
    this.middlewares = middlewares;
    this.nextCallback = this.next.bind(this);
    this.minLevel = minLevel;
  }
  /**
   * Carries events through a chain of middlewares and passes them to the engine in the end
   * @param events
   */


  run(events) {
    if (Array.isArray(events)) {
      const filteredEvents = [];

      for (let i = 0; i < events.length; i++) {
        const el = events[i];

        if ((0, _base.cmpLevels)(this.minLevel, el.level) >= 0) {
          filteredEvents.push(el);
        }
      }

      if (filteredEvents.length === 0) {
        return;
      }

      events = filteredEvents;
    } else if ((0, _base.cmpLevels)(this.minLevel, events.level) < 0) {
      return;
    } // ++ in next method


    this.middlewareIndex = -1;
    this.next(events);
  }

  next(events) {
    this.middlewareIndex++;

    if (this.middlewareIndex < this.middlewares.length) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (this.middlewares[this.middlewareIndex] == null) {
        throw new ReferenceError(`Can't find a middleware at the index [${this.middlewareIndex}]`);
      }

      this.middlewares[this.middlewareIndex].exec(events, this.nextCallback);
    } else if (Array.isArray(events)) {
      for (let i = 0; i < events.length; ++i) {
        this.engine.log(events[i]);
      }
    } else {
      this.engine.log(events);
    }
  }

}

exports.LogPipeline = LogPipeline;