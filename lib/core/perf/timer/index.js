"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getTimerFactory: true
};
exports.getTimerFactory = getTimerFactory;

var _impl = require("../../../core/perf/timer/impl");

var _config = require("../../../core/perf/config");

var _interface = require("../../../core/perf/timer/interface");

Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/perf/timer/README.md]]
 * @packageDocumentation
 */

/**
 * Returns a timers factory for the passed config
 * @param config - config, that the new factory will use
 */
function getTimerFactory(config) {
  return (() => {
    const runners = Object.createDict(),
          scopedRunners = Object.createDict(),
          engine = (0, _config.getTimerEngine)(config),
          predicates = (0, _config.createPredicates)(config.filters ?? Object.createDict());
    return {
      getTimer(group) {
        if (runners[group] == null) {
          runners[group] = new _impl.PerfTimersRunner(engine, {
            filter: predicates[group]
          });
        }

        return runners[group].createTimer(group);
      },

      getScopedTimer(group, scope) {
        const key = `${group}_${scope}`;
        let scopedRunner = scopedRunners[key];

        if (scopedRunner == null) {
          scopedRunner = new _impl.PerfTimersRunner(engine, {
            filter: predicates[group],
            withCurrentTimeOrigin: true
          });
          scopedRunners[key] = scopedRunner;
        }

        return scopedRunner.createTimer(group);
      }

    };
  })();
}