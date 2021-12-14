"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Descriptor = void 0;
exports.getRawValueFromStore = getRawValueFromStore;
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
 * Class to create a custom property descriptor
 */
class Descriptor {
  /**
   * Original property descriptor
   */
  constructor(value) {
    this.descriptor = value;
  }
  /**
   * Returns a value from the descriptor
   * @param receiver - receiver for a get method
   */


  getValue(receiver) {
    const {
      descriptor
    } = this; // eslint-disable-next-line @typescript-eslint/unbound-method

    if (Object.isFunction(descriptor.get)) {
      return descriptor.get.call(receiver);
    }

    return descriptor.value;
  }
  /**
   * Sets a new value to the descriptor
   *
   * @param value
   * @param receiver - receiver for a set method
   */


  setValue(value, receiver) {
    const {
      descriptor
    } = this;

    if (descriptor.set != null) {
      descriptor.set.call(receiver);
      return true;
    }

    if (descriptor.get != null) {
      return false;
    }

    descriptor.value = value;
    return descriptor.value === value;
  }

}
/**
 * Returns a raw value by a key from the specified store
 *
 * @param key
 * @param valStore
 */


exports.Descriptor = Descriptor;

function getRawValueFromStore(key, valStore) {
  let val;

  if (valStore?.has(key)) {
    val = valStore.get(key);
  }

  return val;
}
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