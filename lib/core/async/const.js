"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usedNamespaces = exports.namespacesCache = exports.PromiseNamespaces = exports.PrimitiveNamespaces = exports.Namespaces = void 0;
let Namespaces = function (Namespaces) {
  Namespaces[Namespaces["proxy"] = 0] = "proxy";
  Namespaces[Namespaces["promise"] = 1] = "promise";
  Namespaces[Namespaces["iterable"] = 2] = "iterable";
  Namespaces[Namespaces["request"] = 3] = "request";
  Namespaces[Namespaces["idleCallback"] = 4] = "idleCallback";
  Namespaces[Namespaces["timeout"] = 5] = "timeout";
  Namespaces[Namespaces["interval"] = 6] = "interval";
  Namespaces[Namespaces["immediate"] = 7] = "immediate";
  Namespaces[Namespaces["worker"] = 8] = "worker";
  Namespaces[Namespaces["eventListener"] = 9] = "eventListener";
  Namespaces[Namespaces["animationFrame"] = 10] = "animationFrame";
  Namespaces[Namespaces["proxyPromise"] = 11] = "proxyPromise";
  Namespaces[Namespaces["timeoutPromise"] = 12] = "timeoutPromise";
  Namespaces[Namespaces["intervalPromise"] = 13] = "intervalPromise";
  Namespaces[Namespaces["immediatePromise"] = 14] = "immediatePromise";
  Namespaces[Namespaces["idleCallbackPromise"] = 15] = "idleCallbackPromise";
  Namespaces[Namespaces["animationFramePromise"] = 16] = "animationFramePromise";
  Namespaces[Namespaces["eventListenerPromise"] = 17] = "eventListenerPromise";
  Namespaces[Namespaces["length"] = 18] = "length";
  return Namespaces;
}({});
exports.Namespaces = Namespaces;
let PrimitiveNamespaces = function (PrimitiveNamespaces) {
  PrimitiveNamespaces[PrimitiveNamespaces["proxy"] = 0] = "proxy";
  PrimitiveNamespaces[PrimitiveNamespaces["promise"] = 1] = "promise";
  PrimitiveNamespaces[PrimitiveNamespaces["iterable"] = 2] = "iterable";
  PrimitiveNamespaces[PrimitiveNamespaces["request"] = 3] = "request";
  PrimitiveNamespaces[PrimitiveNamespaces["idleCallback"] = 4] = "idleCallback";
  PrimitiveNamespaces[PrimitiveNamespaces["timeout"] = 5] = "timeout";
  PrimitiveNamespaces[PrimitiveNamespaces["interval"] = 6] = "interval";
  PrimitiveNamespaces[PrimitiveNamespaces["immediate"] = 7] = "immediate";
  PrimitiveNamespaces[PrimitiveNamespaces["worker"] = 8] = "worker";
  PrimitiveNamespaces[PrimitiveNamespaces["eventListener"] = 9] = "eventListener";
  PrimitiveNamespaces[PrimitiveNamespaces["animationFrame"] = 10] = "animationFrame";
  PrimitiveNamespaces[PrimitiveNamespaces["length"] = 11] = "length";
  return PrimitiveNamespaces;
}({});
exports.PrimitiveNamespaces = PrimitiveNamespaces;
let PromiseNamespaces = function (PromiseNamespaces) {
  PromiseNamespaces[PromiseNamespaces["first"] = 10] = "first";
  PromiseNamespaces[PromiseNamespaces["proxyPromise"] = 11] = "proxyPromise";
  PromiseNamespaces[PromiseNamespaces["timeoutPromise"] = 12] = "timeoutPromise";
  PromiseNamespaces[PromiseNamespaces["intervalPromise"] = 13] = "intervalPromise";
  PromiseNamespaces[PromiseNamespaces["immediatePromise"] = 14] = "immediatePromise";
  PromiseNamespaces[PromiseNamespaces["idleCallbackPromise"] = 15] = "idleCallbackPromise";
  PromiseNamespaces[PromiseNamespaces["animationFramePromise"] = 16] = "animationFramePromise";
  PromiseNamespaces[PromiseNamespaces["eventListenerPromise"] = 17] = "eventListenerPromise";
  PromiseNamespaces[PromiseNamespaces["length"] = 18] = "length";
  return PromiseNamespaces;
}({});
exports.PromiseNamespaces = PromiseNamespaces;
const usedNamespaces = new Array(Namespaces.length).fill(false);
exports.usedNamespaces = usedNamespaces;
const namespacesCache = new Array(Namespaces.length).fill(null);
exports.namespacesCache = namespacesCache;