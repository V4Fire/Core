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
class PerfTimersRunner {
  static combineNamespaces(...namespaces) {
    return namespaces.filter(x => x).join('.');
  }
  nsToCounter = Object.createDict();
  idToMeasurement = Object.createDict();
  salt = Math.floor(Math.random() * 1234567890);
  constructor(engine, opts) {
    this.engine = engine;
    this.filter = opts?.filter;
    this.timeOrigin = opts?.withCurrentTimeOrigin === true ? engine.getTimestampFromTimeOrigin() : 0;
  }
  createTimer(group) {
    const makeTimer = namespace => ({
      start: name => {
        if (!Object.isTruly(name)) {
          throw new Error('The metrics name should be defined');
        }
        return this.start(PerfTimersRunner.combineNamespaces(namespace, name));
      },
      finish: (perfTimerId, additional) => this.finish(perfTimerId, additional),
      markTimestamp: (name, additional) => {
        if (!Object.isTruly(name)) {
          throw new Error('The metrics name should be defined');
        }
        return this.markTimestamp(PerfTimersRunner.combineNamespaces(namespace, name), additional);
      },
      namespace(ns) {
        if (!Object.isTruly(ns)) {
          throw new Error('The namespace should be defined');
        }
        return makeTimer(PerfTimersRunner.combineNamespaces(namespace, ns));
      }
    });
    return makeTimer(group);
  }
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
  markTimestamp(name, additional) {
    const timestamp = this.getTimestamp();
    if (this.filter != null && !this.filter(name)) {
      return undefined;
    }
    this.engine.sendDelta(name, timestamp, additional);
  }
  getTimestamp() {
    return this.engine.getTimestampFromTimeOrigin() - this.timeOrigin;
  }
}
exports.default = PerfTimersRunner;