"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeLazy;
function makeLazy(constructor, scheme, hooks) {
  const contexts = [],
    actions = [];
  const mergedScheme = {
    ...getSchemeFromProto(constructor.prototype),
    ...scheme
  };
  setActions(applyActions, mergedScheme);
  applyActions.prototype = constructor.prototype;
  return Object.cast(applyActions);
  function applyActions(...args) {
    let ctx;
    if (new.target === applyActions) {
      ctx = new (Object.cast(constructor))(...args);
    } else {
      ctx = constructor.call(this, ...args);
    }
    if (hooks != null) {
      contexts.push(ctx);
    }
    actions.forEach(fn => {
      fn.call(ctx);
    });
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
              get: () => (...args) => {
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
                if (contexts.length > 0 && hooks?.call != null) {
                  return hooks.call[fullPath.join('.')]?.(Object.cast(contexts), ...args);
                }
              },
              set: fn => {
                actions.push(function setter() {
                  Object.set(this, fullPath, fn);
                  return fn;
                });
                if (contexts.length > 0 && hooks?.set != null) {
                  hooks.set[fullPath.join('.')]?.(Object.cast(contexts), fn);
                }
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
              configurable: true,
              enumerable: true,
              get: () => {
                const path = fullPath.join('.');
                if (contexts.length > 0 && hooks?.get?.[path] != null) {
                  return hooks.get[path](Object.cast(contexts));
                }
                return proxy[store];
              },
              set: val => {
                actions.push(function setter() {
                  Object.set(this, fullPath, val);
                  return val;
                });
                if (contexts.length > 0 && hooks?.set != null) {
                  hooks.set[fullPath.join('.')]?.(Object.cast(contexts), val);
                }
                if (Object.isPrimitive(val) || Object.isFunction(val) || Object.size(scheme) === 0) {
                  proxy[store] = val;
                  return;
                }
                const childProxy = Object.create(val);
                setActions(childProxy, Object.cast(scheme), fullPath);
                proxy[store] = childProxy;
              }
            });
          }
      }
    });
  }
}