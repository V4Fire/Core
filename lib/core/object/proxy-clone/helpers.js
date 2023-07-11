"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Descriptor = void 0;
exports.getRawValueFromStore = getRawValueFromStore;
exports.resolveTarget = resolveTarget;
var _const = require("../../../core/object/proxy-clone/const");
class Descriptor {
  constructor(value) {
    this.descriptor = value;
  }
  getValue(receiver) {
    const {
      descriptor
    } = this;
    if (Object.isFunction(descriptor.get)) {
      return descriptor.get.call(receiver);
    }
    return descriptor.value;
  }
  setValue(value, receiver) {
    const {
      descriptor
    } = this;
    if (descriptor.set != null) {
      descriptor.set.call(receiver, value);
      return true;
    }
    if (descriptor.get != null) {
      return false;
    }
    descriptor.value = value;
    return descriptor.value === value;
  }
}
exports.Descriptor = Descriptor;
function getRawValueFromStore(key, valStore) {
  let val;
  if (valStore?.has(key)) {
    val = valStore.get(key);
  }
  return val;
}
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