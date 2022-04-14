"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = log;

var _functools = require("../../../core/functools");

var _pipelines = _interopRequireDefault(require("../../../core/log/curator/pipelines"));

var _base = require("../../../core/log/base");

var _const = require("../../../core/log/curator/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Sends data to every logging pipeline
 *
 * @param context
 * @param details
 */
function log(context, ...details) {
  let logContext,
      logLevel = _base.DEFAULT_LEVEL;

  if (Object.isString(context)) {
    logContext = context !== '' ? context : _const.DEFAULT_CONTEXT;
  } else {
    logLevel = context.logLevel ?? _base.DEFAULT_LEVEL;
    logContext = context.context !== '' ? context.context : _const.DEFAULT_CONTEXT;
  }

  logContext = `${logContext}:${logLevel}`;
  let logDetails, logError;

  if (details[0] instanceof Error) {
    logError = details[0];
    details = details.slice(1);
  }

  const additionals = {};

  if (details.length > 0) {
    Object.defineProperty(additionals, 'details', {
      configurable: true,
      enumerable: true,

      get() {
        if (logDetails != null) {
          return logDetails;
        }

        return logDetails = prepareDetails(details);
      }

    });
  }

  const event = {
    context: logContext,
    level: logLevel,
    error: logError,
    additionals,

    get details() {
      (0, _functools.deprecate)({
        name: 'details',
        type: 'property',
        renamedTo: 'additionals'
      });
      return additionals;
    }

  };

  for (let i = 0; i < _pipelines.default.length; ++i) {
    try {
      _pipelines.default[i].run(event);
    } catch (e) {
      // TODO: get rid of console
      console.error(e);
    }
  }
}
/**
 * Maps the specified details: executes functions and returns its result
 * @param details
 */


function prepareDetails(details) {
  for (let i = 0; i < details.length; i++) {
    const el = details[i];
    details[i] = Object.isFunction(el) ? el() : el;
  }

  return details;
}