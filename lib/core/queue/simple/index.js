"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _linkedList = _interopRequireDefault(require("../../../core/linked-list"));
var _interface = _interopRequireWildcard(require("../../../core/queue/interface"));
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
class SimpleQueue extends _interface.default {
  get head() {
    return this.innerQueue.first;
  }
  get length() {
    return this.innerQueue.length;
  }
  constructor() {
    super();
    this.innerQueue = this.createInnerQueue();
  }
  push(task) {
    this.innerQueue.push(task);
    return this.length;
  }
  pop() {
    return this.innerQueue.shift();
  }
  clear() {
    if (this.length > 0) {
      this.innerQueue.clear();
    }
  }
  clone() {
    const newQueue = new SimpleQueue();
    newQueue.innerQueue = this.innerQueue.slice();
    return newQueue;
  }
  values() {
    return this.innerQueue.values();
  }
  createInnerQueue = () => new _linkedList.default();
}
exports.default = SimpleQueue;