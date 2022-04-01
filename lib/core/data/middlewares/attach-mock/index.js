"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  attachMock: true
};
exports.attachMock = attachMock;

var _abortable = _interopRequireDefault(require("../../../../core/promise/abortable"));

var env = _interopRequireWildcard(require("../../../../core/env"));

var _data = require("../../../../core/data");

var _request = require("../../../../core/request");

var _interface = require("../../../../core/data/middlewares/attach-mock/interface");

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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/data/middlewares/attach-mock/README.md]]
 * @packageDocumentation
 */
let mockOpts;

const setConfig = opts => {
  const p = {
    patterns: [],
    ...opts
  };
  mockOpts = p;

  if (!mockOpts) {
    return;
  }

  p.patterns = (p.patterns ?? []).map(el => Object.isRegExp(el) ? el : new RegExp(el));
};

const optionsInitializer = env.get('mock').then(setConfig, setConfig);
env.emitter.on('set.mock', setConfig);
env.emitter.on('remove.mock', setConfig);
/**
 * Middleware: attaches mock data from the `mocks` property
 * @param params
 */

async function attachMock(params) {
  if (mockOpts == null) {
    await optionsInitializer;
  }

  if (mockOpts == null) {
    return;
  }

  const {
    opts,
    ctx
  } = params;
  const id = opts.cacheId,
        mocksDecl = this.constructor.mocks ?? this.mocks;
  const canIgnore = mocksDecl == null || !Object.isString(id) || mockOpts.patterns.every(rgxp => !RegExp.test(rgxp, id));

  if (canIgnore) {
    return;
  }

  let mocks = await mocksDecl; // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition

  if (mocks == null) {
    return;
  }

  if ('default' in mocks) {
    mocks = mocks.default;
  }

  const requests = mocks[String(opts.method)];

  if (requests == null) {
    return;
  }

  const requestKeys = ['query', 'body', 'headers'];
  let currentRequest;

  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];

    if (request == null) {
      continue;
    }

    requestKeys: for (let keys = requestKeys, i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (!(key in request)) {
        currentRequest = request;
        continue;
      }

      const valFromMock = request[key],
            reqVal = opts[key];

      if (Object.isPlainObject(valFromMock)) {
        for (let keys = Object.keys(valFromMock), i = 0; i < keys.length; i++) {
          const key = keys[i];

          if (!Object.fastCompare(valFromMock[key], reqVal?.[key])) {
            currentRequest = undefined;
            break requestKeys;
          }
        }

        currentRequest = request;
        continue;
      }

      if (Object.fastCompare(reqVal, valFromMock)) {
        currentRequest = request;
        continue;
      }

      currentRequest = undefined;
    }

    if (currentRequest != null) {
      break;
    }
  }

  if (currentRequest === undefined) {
    return;
  }

  const customResponse = {
    status: undefined,
    responseType: undefined,
    decoders: undefined
  };
  let {
    response
  } = currentRequest;

  if (Object.isFunction(response)) {
    response = response.call(this, params, customResponse);
  }

  return () => _abortable.default.resolve(response, ctx.parent).then(data => {
    const response = new _request.Response(data, {
      status: customResponse.status ?? currentRequest.status ?? 200,
      responseType: customResponse.responseType ?? currentRequest.responseType ?? opts.responseType,
      okStatuses: opts.okStatuses,
      decoder: currentRequest.decoders === false ? undefined : customResponse.decoders ?? ctx.decoders
    });

    if (!response.ok) {
      throw _abortable.default.wrapReasonToIgnore(new _data.RequestError(_data.RequestError.InvalidStatus, {
        request: ctx.params,
        response
      }));
    }

    return response;
  }).then(ctx.wrapAsResponse.bind(ctx));
}