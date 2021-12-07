"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPipeline = createPipeline;

var _base = require("../../../core/log/base");

var _pipeline = require("../../../core/log/curator/pipeline");

var _middlewares = _interopRequireDefault(require("../../../core/log/middlewares"));

var _engines = _interopRequireDefault(require("../../../core/log/engines"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Creates a pipeline by using the config
 * (returns undefined if there are not enough data to create one)
 *
 * @param pipelineConfig
 */
function createPipeline(pipelineConfig) {
  const {
    middlewares,
    engine,
    engineOptions,
    minLevel
  } = pipelineConfig;
  const middlewareInstances = [];

  if (middlewares) {
    for (let i = 0; i < middlewares.length; ++i) {
      const nameOrTuple = middlewares[i];

      if (Object.isString(nameOrTuple)) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (_middlewares.default[nameOrTuple] == null) {
          console.error(`Can't find the middleware "${nameOrTuple}"`);
          continue;
        }

        middlewareInstances.push(_middlewares.default[nameOrTuple]());
      } else {
        const [name, params] = nameOrTuple; // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition

        if (_middlewares.default[name] == null) {
          console.error(`Can't find the middleware "${name}"`);
          continue;
        }

        middlewareInstances.push(_middlewares.default[name](...params));
      }
    }
  } // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition


  if (_engines.default[engine] == null) {
    console.error(`Can't find the engine "${engine}"`);
    return;
  }

  const engineInstance = _engines.default[engine](engineOptions);

  return new _pipeline.LogPipeline(engineInstance, middlewareInstances, minLevel ?? _base.DEFAULT_LEVEL);
}