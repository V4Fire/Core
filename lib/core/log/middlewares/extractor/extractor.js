"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtractorMiddleware = void 0;

var _error = _interopRequireDefault(require("../../../../core/error"));

var _const = require("../../../../core/log/middlewares/extractor/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Middleware to extract information from an error log event and store
 * it within the `additionals` dictionary of the event
 */
class ExtractorMiddleware {
  constructor(...extractors) {
    this.extractorsMap = new Map(extractors.map(ext => [ext.target, ext]));
  }
  /** @inheritDoc */


  exec(events, next) {
    if (Object.isArray(events)) {
      next(events.map(e => this.processEvent(e)));
    } else {
      next(this.processEvent(events));
    }
  }
  /**
   * Extracts error's details from the passed log event and stores it within the `additionals.error` property
   * @param event - log event from a pipeline
   */


  processEvent(event) {
    if (event.error) {
      const error = this.generateErrorInfo(event.error);

      if (Object.size(error) > 0) {
        event.additionals.error = error;
      }
    }

    return event;
  }
  /**
   * Returns an error's info structure
   *
   * @param error - error, which details should be returned
   * @param isRoot - if false then adds `name` and `message` of the passed error to it's info
   * @param depthLimit - maximum depth of nested errors
   */


  generateErrorInfo(error, isRoot = true, depthLimit = _const.DEPTH_LIMIT) {
    const info = {};

    if (!isRoot) {
      info.error = {
        name: error.name,
        message: error.message
      };
    }

    const ctor = Object.getPrototypeOf(error).constructor;

    if (this.extractorsMap.has(ctor)) {
      info.details = this.extractorsMap.get(ctor)?.extract(error);
    } else {
      const details = Object.keys(error).reduce((obj, keyName) => {
        obj[keyName] = error[keyName];
        return obj;
      }, {});

      if (Object.size(details) > 0) {
        info.details = details;
      }
    }

    if (error instanceof _error.default && error.cause) {
      info.cause = depthLimit > 0 ? this.generateErrorInfo(error.cause, false, depthLimit - 1) : undefined;
    }

    return info;
  }

}

exports.ExtractorMiddleware = ExtractorMiddleware;