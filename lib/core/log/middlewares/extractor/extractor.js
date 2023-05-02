"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtractorMiddleware = void 0;
var _error = _interopRequireDefault(require("../../../../core/error"));
var _const = require("../../../../core/log/middlewares/extractor/const");
class ExtractorMiddleware {
  constructor(...extractors) {
    this.extractorsMap = new Map(extractors.map(ext => [ext.target, ext]));
  }
  exec(events, next) {
    if (Object.isArray(events)) {
      next(events.map(e => this.processEvent(e)));
    } else {
      next(this.processEvent(events));
    }
  }
  processEvent(event) {
    if (event.error) {
      const error = this.generateErrorInfo(event.error);
      if (Object.size(error) > 0) {
        event.additionals.error = error;
      }
    }
    return event;
  }
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