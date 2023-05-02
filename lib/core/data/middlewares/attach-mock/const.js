"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setConfig = exports.optionsInitializer = exports.mockOpts = void 0;
var env = _interopRequireWildcard(require("../../../../core/env"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const mockOpts = {
  value: undefined
};
exports.mockOpts = mockOpts;
const setConfig = opts => {
  const p = {
    patterns: [],
    ...opts
  };
  mockOpts.value = p;
  if (mockOpts.value == null) {
    return;
  }
  p.patterns = (p.patterns ?? []).map(el => Object.isRegExp(el) ? el : new RegExp(el));
};
exports.setConfig = setConfig;
const optionsInitializer = env.get('mock').then(setConfig, setConfig);
exports.optionsInitializer = optionsInitializer;