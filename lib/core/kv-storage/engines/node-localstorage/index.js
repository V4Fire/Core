"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  syncLocalStorage: true,
  asyncLocalStorage: true,
  syncSessionStorage: true,
  asyncSessionStorage: true
};
exports.syncSessionStorage = exports.syncLocalStorage = exports.asyncSessionStorage = exports.asyncLocalStorage = void 0;
var _domStorage = _interopRequireDefault(require("dom-storage"));
var fs = _interopRequireWildcard(require("fs-extra"));
var _config = _interopRequireDefault(require("../../../../config"));
var _cache = require("../../../../core/cache");
var _interface = require("../../../../core/kv-storage/engines/node-localstorage/interface");
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
const {
  nodePath
} = _config.default.kvStorage;
if (!fs.existsSync(nodePath)) {
  fs.mkdirpSync(nodePath);
}
const localStorage = new _domStorage.default(`${nodePath}/storage.json`, {
    strict: true,
    ws: ''
  }),
  sessionStorage = new _cache.Cache();
const syncLocalStorage = localStorage,
  asyncLocalStorage = localStorage,
  syncSessionStorage = sessionStorage,
  asyncSessionStorage = sessionStorage;
exports.asyncSessionStorage = asyncSessionStorage;
exports.syncSessionStorage = syncSessionStorage;
exports.asyncLocalStorage = asyncLocalStorage;
exports.syncLocalStorage = syncLocalStorage;