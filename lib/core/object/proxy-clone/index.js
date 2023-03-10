"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;
exports.default = proxyClone;

var support = _interopRequireWildcard(require("../../../core/const/support"));

var _implementation = require("../../../core/functools/implementation");

var _const = require("../../../core/object/proxy-clone/const");

var _helpers = require("../../../core/object/proxy-clone/helpers");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
 * If the runtime supports Proxy, it will be used to clone.
 *
 * @param obj
 */
function clone(obj) {
  return support.proxy ? proxyClone(obj) : Object.fastClone(obj, {
    freezable: false
  });
}
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

    if (!support.proxy) {
      (0, _implementation.unimplement)({
        name: 'proxyClone',
        type: 'function',
        notice: 'An operation of proxy object cloning depends on the support of native Proxy API'
      });
    }

    let lastSetKey;
    const proxy = new Proxy(Object.cast(obj), {
      get: (target, key, receiver) => {
        if (key === _const.toOriginalObject) {
          return target;
        }

        const resolvedTarget = (0, _helpers.resolveTarget)(target, store).value;
        let valStore = store.get(resolvedTarget),
            val = (0, _helpers.getRawValueFromStore)(key, valStore) ?? Reflect.get(resolvedTarget, key, receiver);

        if (val instanceof _helpers.Descriptor) {
          val = val.getValue(receiver);
        }

        if (val === _const.NULL) {
          val = undefined;
        }

        const isArray = Object.isArray(resolvedTarget),
              isCustomObject = isArray || Object.isCustomObject(resolvedTarget);

        if (isArray && !Reflect.has(resolvedTarget, Symbol.isConcatSpreadable)) {
          Object.defineSymbol(resolvedTarget, Symbol.isConcatSpreadable, true);
        }

        if (Object.isFunction(val) && !isCustomObject) {
          if (Object.isMap(resolvedTarget) || Object.isSet(resolvedTarget)) {
            switch (key) {
              case 'get':
                return (...args) => {
                  const val = resolvedTarget[key](...args);
                  return clone(val);
                };

              case 'keys':
              case 'values':
              case Symbol.iterator:
                return (...args) => {
                  const iter = resolvedTarget[key](...args);
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
                return val.bind(resolvedTarget);
            }
          }

          if (Object.isWeakMap(resolvedTarget) || Object.isWeakSet(resolvedTarget)) {
            switch (key) {
              case 'get':
                return prop => {
                  if (valStore == null || !valStore.has(prop)) {
                    return clone(Object.cast(target).get(prop));
                  }

                  const val = resolvedTarget[key](prop);
                  return clone(val);
                };

              case 'set':
                return (prop, val) => {
                  valStore ??= new Map();
                  valStore.set(prop, val);
                  return resolvedTarget[key](prop, val);
                };

              case 'add':
                return prop => {
                  valStore ??= new Map();
                  valStore.set(prop, true);
                  return resolvedTarget[key](prop);
                };

              case 'has':
                return prop => {
                  if (valStore == null || !valStore.has(prop)) {
                    return Object.cast(target).has(prop);
                  }

                  return resolvedTarget[key](prop);
                };

              default:
                return val.bind(resolvedTarget);
            }
          }

          return val.bind(resolvedTarget);
        }

        return clone(val);
      },
      set: (target, key, val, receiver) => {
        lastSetKey = key;
        const {
          value: resolvedTarget,
          needWrap
        } = (0, _helpers.resolveTarget)(target, store);

        if (!needWrap) {
          return Reflect.set(resolvedTarget, key, val);
        }

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

        if (key in resolvedTarget) {
          const valStore = store.get(resolvedTarget) ?? new Map();
          store.set(resolvedTarget, valStore);
          valStore.set(key, val);
        } else {
          Object.defineProperty(receiver, key, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: val
          });
        }

        return true;
      },
      defineProperty: (target, key, desc) => {
        const {
          value: resolvedTarget,
          needWrap
        } = (0, _helpers.resolveTarget)(target, store);

        if (!needWrap || lastSetKey === key) {
          if (lastSetKey === key) {
            lastSetKey = undefined;
          }

          return Reflect.defineProperty(resolvedTarget, key, desc);
        }

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

        const valStore = store.get(resolvedTarget) ?? new Map();
        store.set(resolvedTarget, valStore);
        valStore.set(key, new _helpers.Descriptor(mergedDesc));

        if (!(key in resolvedTarget)) {
          Object.defineProperty(resolvedTarget, key, {
            configurable: true,
            enumerable: false,
            set: value => {
              Object.defineProperty(resolvedTarget, key, {
                configurable: true,
                enumerable: true,
                writable: true,
                value
              });
            },

            get() {
              return undefined;
            }

          });
        }

        return true;
      },
      deleteProperty: (target, key) => {
        const {
          value: resolvedTarget,
          needWrap
        } = (0, _helpers.resolveTarget)(target, store);

        if (!needWrap) {
          return Reflect.deleteProperty(resolvedTarget, key);
        }

        const desc = Reflect.getOwnPropertyDescriptor(resolvedTarget, key);

        if (desc?.configurable === false) {
          return false;
        }

        const valStore = store.get(resolvedTarget) ?? new Map();
        store.set(resolvedTarget, valStore);
        valStore.set(key, _const.NULL);
        return true;
      },
      has: (target, key) => {
        if (key === _const.toOriginalObject) {
          return true;
        }

        const {
          value: resolvedTarget,
          needWrap
        } = (0, _helpers.resolveTarget)(target, store);

        if (!needWrap) {
          return Reflect.has(resolvedTarget, key);
        }

        const valStore = store.get(resolvedTarget);

        if (valStore?.has(key)) {
          return valStore.get(key) !== _const.NULL;
        }

        return Reflect.has(resolvedTarget, key);
      },
      getOwnPropertyDescriptor: (target, key) => {
        const {
          value: resolvedTarget,
          needWrap
        } = (0, _helpers.resolveTarget)(target, store);
        const desc = Reflect.getOwnPropertyDescriptor(resolvedTarget, key);

        if (!needWrap || desc == null) {
          return desc;
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
        const {
          value: resolvedTarget,
          needWrap
        } = (0, _helpers.resolveTarget)(target, store);

        if (!needWrap) {
          return Reflect.ownKeys(resolvedTarget);
        }

        const keys = new Set(Reflect.ownKeys(resolvedTarget)),
              iter = store.get(resolvedTarget)?.entries();

        if (iter != null) {
          for (const [key, val] of iter) {
            if (val === _const.NULL) {
              keys.delete(key);
            } else if (key in resolvedTarget) {
              keys.add(key);
            }
          }
        }

        return [...keys];
      },
      preventExtensions: () => false
    });
    return Object.cast(proxy);
  }
}