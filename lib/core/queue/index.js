"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  AbstractQueue: true,
  WorkerQueueOptions: true,
  AbstractWorkerQueue: true,
  Queue: true,
  MergeWorkerQueue: true,
  OrderedQueue: true
};
Object.defineProperty(exports, "AbstractQueue", {
  enumerable: true,
  get: function () {
    return _interface.default;
  }
});
Object.defineProperty(exports, "AbstractWorkerQueue", {
  enumerable: true,
  get: function () {
    return _interface2.default;
  }
});
Object.defineProperty(exports, "MergeWorkerQueue", {
  enumerable: true,
  get: function () {
    return _merge.default;
  }
});
Object.defineProperty(exports, "OrderedQueue", {
  enumerable: true,
  get: function () {
    return _order.default;
  }
});
Object.defineProperty(exports, "Queue", {
  enumerable: true,
  get: function () {
    return _simple.default;
  }
});
Object.defineProperty(exports, "WorkerQueueOptions", {
  enumerable: true,
  get: function () {
    return _interface2.QueueOptions;
  }
});

var _interface = _interopRequireWildcard(require("../../core/queue/interface"));

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

var _interface2 = _interopRequireWildcard(require("../../core/queue/worker/interface"));

Object.keys(_interface2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface2[key];
    }
  });
});

var _simple = _interopRequireDefault(require("../../core/queue/simple"));

var _merge = _interopRequireDefault(require("../../core/queue/worker/merge"));

var _order = _interopRequireDefault(require("../../core/queue/order"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }