"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throttle = exports.once = exports.debounce = void 0;
var tools = _interopRequireWildcard(require("../../core/functools"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const once = tools.deprecate({
  movedTo: 'core/functools'
}, function once(target, key, descriptor) {
  return tools.once.apply(this, arguments);
});
exports.once = once;
const debounce = tools.deprecate({
  movedTo: 'core/functools'
}, function debounce(delay) {
  return tools.debounce.apply(this, arguments);
});
exports.debounce = debounce;
const throttle = tools.deprecate({
  movedTo: 'core/functools'
}, function throttle(delay) {
  return tools.throttle.apply(this, arguments);
});
exports.throttle = throttle;