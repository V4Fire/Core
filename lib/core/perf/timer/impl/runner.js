"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PerfTimerId", {
  enumerable: true,
  get: function () {
    return _interface.PerfTimerId;
  }
});
exports.default = void 0;

var _interface = require("../../../../core/perf/timer/impl/interface");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Represents abstraction that can measure the difference between time moments and create new performance timers
 */
class PerfTimersRunner {
  /**
   * Combines the passed namespaces together
   * @param namespaces - namespaces to combine
   */
  static combineNamespaces(...namespaces) {
    return namespaces.filter(x => x).join('.');
  }
  /**
   * An engine's instance that sends metrics to the target destination
   */


  /**
   * Internal storage for the following identifier of each namespace
   */
  nsToCounter = Object.createDict();
  /**
   * Internal storage for the current `start`/`finish` metrics
   */

  idToMeasurement = Object.createDict();
  /**
   * Salt for each runner instance.
   * It is used to generate a time, so the times from the different runners cannot be used interchangeably.
   * It prevents sending `start`/`finish` metrics by mistake.
   */

  salt = Math.floor(Math.random() * 1234567890);
  /**
   * @param engine - engine instance that sends metrics to the target destination
   * @param [opts] - runner's options
   */

  constructor(engine, opts) {
    this.engine = engine;
    this.filter = opts?.filter;
    this.timeOrigin = opts?.withCurrentTimeOrigin === true ? engine.getTimestampFromTimeOrigin() : 0;
  }
  /**
   * Returns a new instance of the performance timer
   * @param group - timer group
   */


  createTimer(group) {
    const makeTimer = namespace => ({
      /** @see [[PerfTimer.start]] */
      start: name => {
        if (!Object.isTruly(name)) {
          throw new Error('The metrics name should be defined');
        }

        return this.start(PerfTimersRunner.combineNamespaces(namespace, name));
      },

      /** @see [[PerfTimer.finish]] */
      finish: (perfTimerId, additional) => this.finish(perfTimerId, additional),

      /** @see [[PerfTimer.markTimestamp]] */
      markTimestamp: (name, additional) => {
        if (!Object.isTruly(name)) {
          throw new Error('The metrics name should be defined');
        }

        return this.markTimestamp(PerfTimersRunner.combineNamespaces(namespace, name), additional);
      },

      /** @see [[PerfTimer.namespace]] */
      namespace(ns) {
        if (!Object.isTruly(ns)) {
          throw new Error('The namespace should be defined');
        }

        return makeTimer(PerfTimersRunner.combineNamespaces(namespace, ns));
      }

    });

    return makeTimer(group);
  }
  /** @see [[PerfTimer.start]] */


  start(name) {
    const timestamp = this.getTimestamp();

    if (this.filter != null && !this.filter(name)) {
      return undefined;
    }

    this.nsToCounter[name] = (this.nsToCounter[name] ?? 0) + 1;
    const timerId = `${this.salt}-${name}-${this.nsToCounter[name]}`;
    this.idToMeasurement[timerId] = {
      startTimestamp: timestamp,
      name
    };
    return timerId;
  }
  /** @see [[PerfTimer.finish]] */


  finish(perfTimerId, additional) {
    const timestamp = this.getTimestamp();

    if (perfTimerId == null) {
      return;
    }

    const measurement = this.idToMeasurement[perfTimerId];

    if (measurement == null) {
      console.warn(`A timer with the id "${perfTimerId}" doesn't exist`);
      return;
    }

    this.idToMeasurement[perfTimerId] = undefined;
    const duration = timestamp - measurement.startTimestamp;
    this.engine.sendDelta(measurement.name, duration, additional);
  }
  /** @see [[PerfTimer.markTimestamp]] */


  markTimestamp(name, additional) {
    const timestamp = this.getTimestamp();

    if (this.filter != null && !this.filter(name)) {
      return undefined;
    }

    this.engine.sendDelta(name, timestamp, additional);
  }
  /**
   * Returns a timestamp taking into account the runner's timer origin
   */


  getTimestamp() {
    return this.engine.getTimestampFromTimeOrigin() - this.timeOrigin;
  }

}

exports.default = PerfTimersRunner;