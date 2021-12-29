"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = proxyClone;

var _implementation = require("../../../core/functools/implementation");

var _const = require("../../../core/object/proxy-clone/const");

var _helpers = require("../../../core/object/proxy-clone/helpers");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/object/proxy-clone/README.md]]
 * @packageDocumentation
 */

/**
 * Returns a clone of the specified object.
 * The function uses a Proxy object to create a clone. The process of cloning is a lazy operation.
 *
 * @param obj
 */
function proxyClone(obj) {
  const store = new WeakMap();
  return clone(obj);

  function clone(obj) {
    if (Object.isPrimitive(obj) || Object.isFrozen(obj)) {
      return obj;
    }

    if (typeof Proxy !== 'function') {
      (0, _implementation.unimplement)({
        name: 'proxyClone',
        type: 'function',
        notice: 'An operation of proxy object cloning depends on the support of native Proxy API'
      });
    }

    let lastSetKey;
    const proxy = new Proxy(Object.cast(obj), {
      get: (target, key, receiver) => {
        const originalTarget = target;
        target = (0, _helpers.resolveTarget)(target, store).value;
        let valStore = store.get(target),
            val = (0, _helpers.getRawValueFromStore)(key, valStore) ?? Reflect.get(target, key, receiver);

        if (val instanceof _helpers.Descriptor) {
          val = val.getValue(receiver);
        }

        if (val === _const.NULL) {
          val = undefined;
        }

        const isArray = Object.isArray(target),
              isCustomObject = isArray || Object.isCustomObject(target);

        if (isArray && !Reflect.has(target, Symbol.isConcatSpreadable)) {
          target[Symbol.isConcatSpreadable] = true;
        }

        if (Object.isFunction(val) && !isCustomObject) {
          if (Object.isMap(target) || Object.isSet(target)) {
            switch (key) {
              case 'get':
                return (...args) => {
                  const val = target[key](...args);
                  return clone(val);
                };

              case 'keys':
              case 'values':
              case Symbol.iterator:
                return (...args) => {
                  const iter = target[key](...args);
                  return {
                    [Symbol.iterator]() {
                      return this;
                    },

                    next: () => {
                      const res = iter.next();
                      return {
                        done: res.done,
                        value: clone(res.value)
                      };
                    }
                  };
                };

              default:
                return val.bind(target);
            }
          }

          if (Object.isWeakMap(target) || Object.isWeakSet(target)) {
            switch (key) {
              case 'get':
                return prop => {
                  if (valStore == null || !valStore.has(prop)) {
                    return clone(Object.cast(originalTarget).get(prop));
                  }

                  const val = target[key](prop);
                  return clone(val);
                };

              case 'set':
                return (prop, val) => {
                  valStore ??= new Map();
                  valStore.set(prop, val);
                  return target[key](prop, val);
                };

              case 'add':
                return prop => {
                  valStore ??= new Map();
                  valStore.set(prop, true);
                  return target[key](prop);
                };

              case 'has':
                return prop => {
                  if (valStore == null || !valStore.has(prop)) {
                    return Object.cast(originalTarget).has(prop);
                  }

                  return target[key](prop);
                };

              default:
                return val.bind(target);
            }
          }

          return val.bind(target);
        }

        return clone(val);
      },
      set: (target, key, val, receiver) => {
        lastSetKey = key;
        const {
          value: resolvedTarget,
          needWrap
        } = (0, _helpers.resolveTarget)(target, store);
        const rawValue = (0, _helpers.getRawValueFromStore)(key, store.get(resolvedTarget));

        if (rawValue instanceof _helpers.Descriptor) {
          return rawValue.setValue(val, receiver);
        }

        const desc = Reflect.getOwnPropertyDescriptor(receiver, key);

        if (desc != null) {
          if (desc.writable === false || desc.get != null && desc.set == null) {
            return false;
          }

          if (desc.set != null) {
            desc.set.call(receiver, val);
            return true;
          }
        }

        if (needWrap) {
          if (key in resolvedTarget) {
            const valStore = store.get(resolvedTarget) ?? new Map();
            store.set(resolvedTarget, valStore);
            valStore.set(key, val);
          } else {
            Object.defineProperty(receiver, key, {
              configurable: true,
              writable: true,
              enumerable: true,
              value: val
            });
          }

          return true;
        }

        return Reflect.set(resolvedTarget, key, val);
      },
      defineProperty: (target, key, desc) => {
        if (lastSetKey === key) {
          lastSetKey = undefined;
          return Reflect.defineProperty(target, key, desc);
        }

        const {
          value: resolvedTarget,
          needWrap
        } = (0, _helpers.resolveTarget)(target, store);
        const rawValue = (0, _helpers.getRawValueFromStore)(key, store.get(resolvedTarget)),
              oldDesc = Reflect.getOwnPropertyDescriptor(resolvedTarget, key);

        if (oldDesc?.configurable === false && (oldDesc.writable === false || Object.size(desc) > 1 || !('value' in desc))) {
          return false;
        }

        const mergedDesc = {
          configurable: desc.configurable !== false
        };

        if (oldDesc != null) {
          const baseDesc = {
            configurable: oldDesc.configurable,
            enumerable: oldDesc.enumerable
          };
          Object.assign(mergedDesc, baseDesc);

          if (rawValue instanceof _helpers.Descriptor) {
            Object.assign(mergedDesc, rawValue.descriptor);
          }

          Object.assign(mergedDesc, desc);

          if (desc.get != null || desc.set != null) {
            delete mergedDesc['value'];
            delete mergedDesc['writable'];
          } else {
            delete mergedDesc['get'];
            delete mergedDesc['set'];
          }
        } else {
          Object.assign(mergedDesc, desc);
        }

        if (needWrap) {
          const valStore = store.get(resolvedTarget) ?? new Map();
          store.set(resolvedTarget, valStore);
          valStore.set(key, new _helpers.Descriptor(mergedDesc));

          if (!(key in resolvedTarget)) {
            Object.defineProperty(resolvedTarget, key, {
              configurable: true,
              enumerable: false,
              set: value => {
                Object.defineProperty(resolvedTarget, key, {
                  enumerable: true,
                  writable: true,
                  configurable: true,
                  value
                });
              },

              get() {
                return undefined;
              }

            });
          }

          return true;
        }

        return Reflect.defineProperty(resolvedTarget, key, mergedDesc);
      },
      deleteProperty: (target, key) => {
        const {
          value: resolvedTarget,
          needWrap
        } = (0, _helpers.resolveTarget)(target, store);
        const desc = Reflect.getOwnPropertyDescriptor(resolvedTarget, key);

        if (desc?.configurable === false) {
          return false;
        }

        if (needWrap) {
          const valStore = store.get(resolvedTarget) ?? new Map();
          store.set(resolvedTarget, valStore);
          valStore.set(key, _const.NULL);
          return true;
        }

        return Reflect.deleteProperty(resolvedTarget, key);
      },
      has: (target, key) => {
        const resolvedTarget = (0, _helpers.resolveTarget)(target, store).value,
              valStore = store.get(resolvedTarget);

        if (valStore?.has(key)) {
          return valStore.get(key) !== _const.NULL;
        }

        return Reflect.has(resolvedTarget, key);
      },
      getOwnPropertyDescriptor: (target, key) => {
        const resolvedTarget = (0, _helpers.resolveTarget)(target, store).value,
              desc = Reflect.getOwnPropertyDescriptor(resolvedTarget, key);

        if (desc == null) {
          return;
        }

        const rawVal = (0, _helpers.getRawValueFromStore)(key, store.get(resolvedTarget));

        if (rawVal instanceof _helpers.Descriptor) {
          const rawDesc = rawVal.descriptor;

          if (desc.configurable) {
            return rawVal.descriptor;
          }

          const mergedDesc = { ...desc
          };

          if (rawDesc.get == null && rawDesc.set == null) {
            mergedDesc.value = rawVal.getValue(proxy);
          }

          return mergedDesc;
        }

        return desc;
      },
      ownKeys: target => {
        const resolvedTarget = (0, _helpers.resolveTarget)(target, store).value;

        if (Object.isArray(resolvedTarget) || Object.isMap(resolvedTarget) || Object.isWeakMap(resolvedTarget) || Object.isSet(resolvedTarget) || Object.isWeakSet(resolvedTarget)) {
          return Reflect.ownKeys(resolvedTarget);
        }

        const keys = new Set(Reflect.ownKeys(resolvedTarget));
        Object.forEach(store.get(resolvedTarget)?.entries(), ([key, val]) => {
          if (val === _const.NULL) {
            keys.delete(key);
          } else if (key in resolvedTarget) {
            keys.add(key);
          }
        });
        return [...keys];
      },
      preventExtensions: () => false
    });
    return Object.cast(proxy);
  }
}