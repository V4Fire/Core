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
        if (_middlewares.default[nameOrTuple] == null) {
          console.error(`Can't find the middleware "${nameOrTuple}"`);
          continue;
        }
        middlewareInstances.push(_middlewares.default[nameOrTuple]());
      } else {
        const [name, params] = nameOrTuple;
        if (_middlewares.default[name] == null) {
          console.error(`Can't find the middleware "${name}"`);
          continue;
        }
        middlewareInstances.push(_middlewares.default[name](...params));
      }
    }
  }
  if (_engines.default[engine] == null) {
    console.error(`Can't find the engine "${engine}"`);
    return;
  }
  const engineInstance = _engines.default[engine](engineOptions);
  return new _pipeline.LogPipeline(engineInstance, middlewareInstances, minLevel ?? _base.DEFAULT_LEVEL);
}