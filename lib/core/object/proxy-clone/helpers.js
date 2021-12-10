"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveTarget = resolveTarget;

var _const = require("../../../core/object/proxy-clone/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Resolves the specified target by a value from the store and returns it
 *
 * @param store
 * @param target
 */
function resolveTarget(target, store) {
  if (Object.isPrimitive(target) || Object.isFrozen(target)) {
    return {
      value: target,
      needWrap: false
    };
  }

  const obj = Object.cast(target);
  let clonedObj = undefined,
      valStore = store.get(obj);

  if (valStore?.has(_const.SELF)) {
    return {
      value: Object.cast(valStore.get(_const.SELF)),
      needWrap: false
    };
  }

  if (Object.isArray(obj)) {
    clonedObj = obj.slice();
  } else if (Object.isMap(obj) || Object.isSet(obj)) {
    clonedObj = new (Object.cast(obj.constructor))(obj);
  } else if (Object.isWeakMap(obj) || Object.isWeakSet(obj)) {
    clonedObj = new (Object.cast(obj.constructor))();
  }

  if (clonedObj != null) {
    valStore ??= new Map();
    store.set(obj, valStore);
    valStore.set(_const.SELF, clonedObj);
    store.set(clonedObj, valStore);
    return {
      value: Object.cast(clonedObj),
      needWrap: false
    };
  }

  return {
    value: Object.cast(obj),
    needWrap: true
  };
}