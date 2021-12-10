"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeLazy;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/lazy/README.md]]
 * @packageDocumentation
 */

/**
 * Creates a new function based on the passed function or class and returns it.
 * The new function accumulates all method and properties actions into a queue.
 * The queue will drain after invoking the created function.
 *
 * @param constructor
 * @param scheme
 */
function makeLazy(constructor, scheme) {
  const actions = [constructor];
  const mergedScheme = { ...getSchemeFromProto(constructor.prototype),
    ...scheme
  };
  setActions(applyActions, mergedScheme);
  applyActions.prototype = constructor.prototype;
  return applyActions;

  function applyActions(...args) {
    let ctx;

    if (new.target === applyActions) {
      ctx = new (Object.cast(constructor))(...args);
    } else {
      ctx = constructor.call(this, ...args);
    }

    actions.slice(1).forEach(fn => {
      fn.call(ctx);
    });
    actions.splice(1, actions.length);
    setActions(applyActions, mergedScheme);
    return ctx;
  }

  function getSchemeFromProto(obj, res = {}) {
    if (obj == null) {
      return res;
    }

    const blackListRgxp = /^__\w+__$/;
    Object.getOwnPropertyNames(obj).forEach(key => {
      if (blackListRgxp.test(key)) {
        return;
      }

      const val = Object.getOwnPropertyDescriptor(obj, key)?.value;

      if (Object.isFunction(val)) {
        res[key] = Object.cast(Function);
      } else {
        res[key] = getSchemeFromProto(val);
      }
    });
    return getSchemeFromProto(Object.getPrototypeOf(obj), res);
  }

  function setActions(proxy, scheme, breadcrumbs = []) {
    Object.forEach(scheme, (scheme, key) => {
      const fullPath = [...breadcrumbs, key];

      switch (typeof scheme) {
        case 'function':
          {
            Object.defineProperty(proxy, key, {
              configurable: true,
              value: (...args) => {
                actions.push(function method() {
                  const obj = Object.get(this, breadcrumbs);

                  if (obj == null) {
                    throw new ReferenceError(`A method by the specified path "${fullPath.join('.')}" is not defined`);
                  }

                  if (!Object.isFunction(obj[key])) {
                    throw new ReferenceError(`A method by the specified path "${fullPath.join('.')}" is not a function`);
                  }

                  return obj[key](...args);
                });
              }
            });
            break;
          }

        default:
          {
            const store = Symbol(key);

            if (Object.isPrimitive(scheme)) {
              proxy[store] = scheme;
            } else if (Object.size(scheme) > 0) {
              const childProxy = {};
              setActions(childProxy, scheme, fullPath);
              proxy[store] = childProxy;
            }

            Object.defineProperty(proxy, key, {
              enumerable: true,
              configurable: true,
              get: () => proxy[store],
              set: val => {
                actions.push(function setter() {
                  Object.set(this, fullPath, val);
                  return val;
                });

                if (Object.isPrimitive(val) || Object.isFunction(val) || Object.size(scheme) === 0) {
                  proxy[store] = val;
                  return;
                }

                const childProxy = Object.create(val);
                setActions(childProxy, scheme, fullPath);
                proxy[store] = childProxy;
              }
            });
          }
      }
    });
  }
}