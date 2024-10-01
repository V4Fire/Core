"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = select;
var _interface = require("../../../core/object/select/interface");
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
function select(obj, params = {}) {
  const {
    where,
    from
  } = params;
  let target = obj,
    res;
  if (from != null) {
    target = Object.get(target, Object.isArray(from) ? from : String(from));
    if (where == null) {
      return Object.cast(target);
    }
  }
  const cantSearch = Object.isPrimitive(target) || where == null || Object.isArray(where) && where.length === 0;
  if (cantSearch) {
    return;
  }
  const NULL = {};
  where: for (let conditions = Array.toArray(where), i = 0; i < conditions.length; i++) {
    const where = conditions[i];
    if (Object.isPlainObject(target)) {
      const match = getMatch(target, where);
      if (match !== NULL) {
        res = match;
        break;
      }
    }
    if (Object.isIterable(target)) {
      const iterator = target[Symbol.iterator]();
      for (let el = iterator.next(); !el.done; el = iterator.next()) {
        if (getMatch(el.value, where) !== NULL) {
          res = el.value;
          break where;
        }
      }
    }
  }
  return res;
  function getMatch(obj, where) {
    if (where == null || obj === where) {
      return obj;
    }
    if (Object.isPrimitive(obj)) {
      return NULL;
    }
    const resolvedObj = obj;
    let res = NULL;
    for (let keys = Object.keys(where), i = 0; i < keys.length; i++) {
      const key = keys[i],
        val = where[key];
      if (!(key in resolvedObj)) {
        continue;
      }
      if (!Object.fastCompare(val, resolvedObj[key])) {
        res = NULL;
        break;
      }
      res = resolvedObj;
    }
    return res;
  }
}