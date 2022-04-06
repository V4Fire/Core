"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Socket: true,
  globalOpts: true,
  CreateRequestOptions: true,
  CacheStrategy: true,
  RequestQuery: true,
  RequestMethod: true,
  Middlewares: true,
  MiddlewareParams: true,
  RequestPromise: true,
  RequestResponse: true,
  RequestResponseObject: true,
  RequestFunctionResponse: true,
  Response: true,
  RequestBody: true,
  RequestError: true
};
Object.defineProperty(exports, "CacheStrategy", {
  enumerable: true,
  get: function () {
    return _request.CacheStrategy;
  }
});
Object.defineProperty(exports, "CreateRequestOptions", {
  enumerable: true,
  get: function () {
    return _request.CreateRequestOptions;
  }
});
Object.defineProperty(exports, "MiddlewareParams", {
  enumerable: true,
  get: function () {
    return _request.MiddlewareParams;
  }
});
Object.defineProperty(exports, "Middlewares", {
  enumerable: true,
  get: function () {
    return _request.Middlewares;
  }
});
Object.defineProperty(exports, "RequestBody", {
  enumerable: true,
  get: function () {
    return _request.RequestBody;
  }
});
Object.defineProperty(exports, "RequestError", {
  enumerable: true,
  get: function () {
    return _request.RequestError;
  }
});
Object.defineProperty(exports, "RequestFunctionResponse", {
  enumerable: true,
  get: function () {
    return _request.RequestFunctionResponse;
  }
});
Object.defineProperty(exports, "RequestMethod", {
  enumerable: true,
  get: function () {
    return _request.RequestMethod;
  }
});
Object.defineProperty(exports, "RequestPromise", {
  enumerable: true,
  get: function () {
    return _request.RequestPromise;
  }
});
Object.defineProperty(exports, "RequestQuery", {
  enumerable: true,
  get: function () {
    return _request.RequestQuery;
  }
});
Object.defineProperty(exports, "RequestResponse", {
  enumerable: true,
  get: function () {
    return _request.RequestResponse;
  }
});
Object.defineProperty(exports, "RequestResponseObject", {
  enumerable: true,
  get: function () {
    return _request.RequestResponseObject;
  }
});
Object.defineProperty(exports, "Response", {
  enumerable: true,
  get: function () {
    return _request.Response;
  }
});
Object.defineProperty(exports, "Socket", {
  enumerable: true,
  get: function () {
    return _socket.Socket;
  }
});
exports.default = void 0;
Object.defineProperty(exports, "globalOpts", {
  enumerable: true,
  get: function () {
    return _request.globalOpts;
  }
});

var _base = _interopRequireDefault(require("../../core/data/modules/base"));

var _decorators = require("../../core/data/decorators");

Object.keys(_decorators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _decorators[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _decorators[key];
    }
  });
});

var _middlewares = require("../../core/data/middlewares");

Object.keys(_middlewares).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _middlewares[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _middlewares[key];
    }
  });
});

var _const = require("../../core/data/const");

Object.keys(_const).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _const[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _const[key];
    }
  });
});

var _interface = require("../../core/data/interface");

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

var _socket = require("../../core/socket");

var _request = require("../../core/request");

var _class;

let Provider =
/**
 * Default data provider
 */
(0, _decorators.provider)(_class = class Provider extends _base.default {
  static middlewares = {
    attachMock: _middlewares.attachMock
  };
  /**
   * Borrows API from the specified `RequestPromise` object to the passed `RequestResponse` object and returns it
   *
   * @param from
   * @param to
   */

  static borrowRequestPromiseAPI(from, to) {
    const res = to;
    res.emitter = from.emitter;
    void Object.defineProperty(res, 'data', {
      enumerable: true,
      configurable: true,
      get: () => from.data
    });
    void Object.defineProperty(res, 'stream', {
      enumerable: true,
      configurable: true,
      get: () => from.stream
    });
    res[Symbol.asyncIterator] = from[Symbol.asyncIterator].bind(from);
    return res;
  }
  /** @override */


  constructor(opts) {
    super(opts);
  }

}) || _class;

exports.default = Provider;