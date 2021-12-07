"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storage = exports.pendingCache = exports.methodsWithoutBody = exports.isAbsoluteURL = exports.globalOpts = exports.defaultRequestOpts = exports.caches = exports.cache = void 0;

var _config = _interopRequireDefault(require("../../config"));

var _sync = require("../../core/promise/sync");

var _url = require("../../core/url");

var _cache = require("../../core/cache");

var _engines = _interopRequireDefault(require("../../core/request/engines"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// eslint-disable-next-line import/no-mutable-exports
let storage; // eslint-disable-next-line prefer-const

exports.storage = storage;
exports.storage = storage = (0, _sync.memoize)(Promise.resolve().then(() => _interopRequireWildcard(require('../../core/kv-storage'))).then(({
  asyncLocal
}) => asyncLocal.namespace('[[REQUEST]]')));
const isAbsoluteURL = /^\w*:?\/\//;
exports.isAbsoluteURL = isAbsoluteURL;
const caches = new Set(),
      pendingCache = new _cache.Cache();
exports.pendingCache = pendingCache;
exports.caches = caches;
const cache = {
  queue: new _cache.RestrictedCache(),
  forever: new _cache.Cache(),
  never: new _cache.NeverCache()
};
exports.cache = cache;
const globalOpts = {
  get api() {
    return _config.default.api;
  },

  set api(value) {
    _config.default.api = value;
  },

  meta: {}
};
exports.globalOpts = globalOpts;
const methodsWithoutBody = Object.createDict({
  GET: true,
  HEAD: true
});
exports.methodsWithoutBody = methodsWithoutBody;
const defaultRequestOpts = {
  method: 'GET',
  cacheStrategy: 'never',
  cacheMethods: ['GET'],
  offlineCacheTTL: 1 .day(),
  headers: {},
  query: {},
  meta: {},
  engine: _engines.default,
  querySerializer: _url.toQueryString
};
exports.defaultRequestOpts = defaultRequestOpts;