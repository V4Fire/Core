"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Namespaces: true,
  LinkNames: true
};
exports.Namespaces = exports.LinkNames = void 0;

var _interface = require("../../core/async/modules/base/interface");

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

var _interface2 = require("../../core/async/modules/events/interface");

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

var _interface3 = require("../../core/async/modules/proxy/interface");

Object.keys(_interface3).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface3[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface3[key];
    }
  });
});

var _interface4 = require("../../core/async/modules/timers/interface");

Object.keys(_interface4).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface4[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface4[key];
    }
  });
});

var _interface5 = require("../../core/async/modules/wrappers/interface");

Object.keys(_interface5).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface5[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface5[key];
    }
  });
});

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
let Namespaces;
exports.LinkNames = exports.Namespaces = Namespaces;

(function (Namespaces) {
  Namespaces[Namespaces["proxy"] = 0] = "proxy";
  Namespaces[Namespaces["proxyPromise"] = 1] = "proxyPromise";
  Namespaces[Namespaces["promise"] = 2] = "promise";
  Namespaces[Namespaces["iterable"] = 3] = "iterable";
  Namespaces[Namespaces["request"] = 4] = "request";
  Namespaces[Namespaces["idleCallback"] = 5] = "idleCallback";
  Namespaces[Namespaces["idleCallbackPromise"] = 6] = "idleCallbackPromise";
  Namespaces[Namespaces["timeout"] = 7] = "timeout";
  Namespaces[Namespaces["timeoutPromise"] = 8] = "timeoutPromise";
  Namespaces[Namespaces["interval"] = 9] = "interval";
  Namespaces[Namespaces["intervalPromise"] = 10] = "intervalPromise";
  Namespaces[Namespaces["immediate"] = 11] = "immediate";
  Namespaces[Namespaces["immediatePromise"] = 12] = "immediatePromise";
  Namespaces[Namespaces["worker"] = 13] = "worker";
  Namespaces[Namespaces["eventListener"] = 14] = "eventListener";
  Namespaces[Namespaces["eventListenerPromise"] = 15] = "eventListenerPromise";
})(Namespaces || (exports.LinkNames = exports.Namespaces = Namespaces = {}));