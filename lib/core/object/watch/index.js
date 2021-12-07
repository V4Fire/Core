"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  mute: true,
  unmute: true,
  set: true,
  unset: true,
  unwrap: true,
  isProxy: true,
  getProxyType: true
};
exports.default = void 0;
Object.defineProperty(exports, "getProxyType", {
  enumerable: true,
  get: function () {
    return _helpers2.getProxyType;
  }
});
Object.defineProperty(exports, "isProxy", {
  enumerable: true,
  get: function () {
    return _helpers2.isProxy;
  }
});
exports.mute = mute;
exports.set = set;
exports.unmute = unmute;
exports.unset = unset;
Object.defineProperty(exports, "unwrap", {
  enumerable: true,
  get: function () {
    return _helpers2.unwrap;
  }
});

var _engines = _interopRequireDefault(require("../../../core/object/watch/engines"));

var _const = require("../../../core/object/watch/const");

Object.keys(_const).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _const[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _const[key];
    }
  });
});

var _helpers = require("../../../core/object/watch/helpers");

var _helpers2 = require("../../../core/object/watch/engines/helpers");

var _interface = require("../../../core/object/watch/interface");

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

/* eslint-disable @typescript-eslint/unified-signatures */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/object/watch/README.md]]
 * @packageDocumentation
 */
var _default = watch;
/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param [handler] - callback that is invoked on every mutation hook
 */

exports.default = _default;

// eslint-disable-next-line max-lines-per-function
function watch(obj, pathOptsOrHandler, handlerOrOpts, optsOrHandler) {
  const isPathParsedFromString = Symbol('Is the path parsed from a string'),
        unwrappedObj = (0, _helpers2.unwrap)(obj);
  let wrappedHandler, handler, opts;
  let timer, normalizedPath; // Support for overloads of the function

  if (Object.isString(pathOptsOrHandler) || Object.isArray(pathOptsOrHandler)) {
    if (Object.isArray(pathOptsOrHandler)) {
      normalizedPath = pathOptsOrHandler;
    } else {
      normalizedPath = pathOptsOrHandler.split('.');
      normalizedPath[isPathParsedFromString] = true;
    }

    if (Object.isFunction(handlerOrOpts)) {
      handler = handlerOrOpts;
    } else {
      opts = handlerOrOpts;

      if (Object.isFunction(optsOrHandler)) {
        handler = optsOrHandler;
      }
    }
  } else if (Object.isFunction(pathOptsOrHandler)) {
    handler = pathOptsOrHandler;
  } else {
    opts = pathOptsOrHandler;

    if (Object.isFunction(handlerOrOpts)) {
      handler = handlerOrOpts;
    }
  }

  opts ??= {};
  opts.engine = opts.engine ?? _engines.default;
  const rawDeps = Object.size(opts.dependencies) > 0 ? opts.dependencies : undefined;
  let depsMap, localDeps, deps; // Normalize dependencies

  if (rawDeps != null && unwrappedObj != null) {
    const convert = dep => {
      if (Object.isString(dep)) {
        dep = dep.split('.');
        dep[isPathParsedFromString] = true;
      }

      return dep;
    };

    if (Object.isArray(rawDeps)) {
      localDeps = [];

      if (normalizedPath != null) {
        for (let i = 0; i < rawDeps.length; i++) {
          localDeps.push(convert(rawDeps[i]));
        }
      }
    } else {
      deps = [];
      depsMap = new Map();
      Object.forEach(rawDeps, (dep, key) => {
        if (!Object.isArray(dep)) {
          throw new TypeError('Invalid format of dependencies');
        }

        let localDeps;

        if (Object.isArray(dep)) {
          localDeps = dep.slice();

          for (let i = 0; i < localDeps.length; i++) {
            localDeps[i] = convert(localDeps[i]);
          }
        } else {
          localDeps = [convert(dep)];
        }

        const path = convert(key);
        deps.push([path, localDeps]);
        Object.set(depsMap, path, localDeps);
      });

      if (depsMap.size > 0) {
        const expandDeps = deps => {
          for (let i = 0; i < deps.length; i++) {
            const dep = Object.get(depsMap, deps[i]);

            if (dep != null) {
              deps.splice(i, 1, ...expandDeps(dep));
            }
          }

          return deps;
        };

        for (let i = 0; i < deps.length; i++) {
          expandDeps(deps[i][1]);
        }

        if (normalizedPath != null) {
          localDeps = Object.get(depsMap, normalizedPath);
        }
      }
    }
  }

  opts.deep = normalizedPath != null && normalizedPath.length > 1 || opts.deep;
  const {
    deep,
    collapse
  } = opts;
  const pref = opts.prefixes,
        post = opts.postfixes;
  const {
    immediate,
    withProto,
    tiedWith,
    pathModifier,
    eventFilter
  } = opts; // If we have a handler and valid object to watch,
  // we need to wrap this handler to provide all features of watching

  if (handler != null && unwrappedObj != null) {
    let dynamicValStore,
        argsQueue = [];

    wrappedHandler = (value, oldValue, info) => {
      const originalPath = info.path;

      if (pathModifier != null) {
        info = { ...info,
          path: pathModifier(info.path)
        };
      }

      info.originalPath = originalPath;

      if ( // We don't watch deep mutations
      !deep && info.path.length > (Object.isDictionary(info.obj) ? 1 : 2) || // We don't watch prototype mutations
      !withProto && info.fromProto || // The mutation is skipped by the filter
      eventFilter != null && !Object.isTruly(eventFilter(value, oldValue, info))) {
        return;
      }

      let cache;

      const fireMutationEvent = (tiedPath, needGetVal = false) => {
        let resolvedInfo = info; // If we have a tied property with the property that have a mutation,
        // we need to register it

        if (tiedPath != null) {
          cache ??= new Map();

          if (Object.get(cache, tiedPath) === true) {
            return;
          }

          Object.set(cache, tiedPath, true);
          resolvedInfo = { ...info,
            path: tiedPath.slice(),
            parent: {
              value,
              oldValue,
              info
            }
          };
        } // Returns a list of attributes to the mutation handler


        const getArgs = () => {
          if (needGetVal) {
            const dynamicVal = Object.get(unwrappedObj, collapse ? tiedPath[0] : tiedPath);

            if (Object.size(handler) < 2) {
              return [dynamicVal, undefined, resolvedInfo];
            }

            dynamicValStore ??= new Map();
            const args = [dynamicVal, Object.get(dynamicValStore, resolvedInfo.path), resolvedInfo];
            Object.set(dynamicValStore, resolvedInfo.path, dynamicVal);
            return args;
          }

          if (collapse) {
            const isRoot = resolvedInfo.obj === resolvedInfo.root;
            return [isRoot ? value : resolvedInfo.top, isRoot ? oldValue : resolvedInfo.top, resolvedInfo];
          }

          if (collapse !== false && normalizedPath != null && normalizedPath.length < resolvedInfo.originalPath.length) {
            const val = Object.get(unwrappedObj, normalizedPath);
            return [val, val, resolvedInfo];
          }

          return [value, oldValue, resolvedInfo];
        };

        if (immediate) {
          // eslint-disable-next-line prefer-spread
          handler.apply(null, getArgs()); // Deferred events
        } else {
          const needEventQueue = normalizedPath == null || collapse === false;

          if (needEventQueue) {
            argsQueue.push(getArgs());
          } else {
            argsQueue = getArgs();
          }

          if (timer == null) {
            timer = setImmediate(() => {
              timer = undefined;

              try {
                if (needEventQueue) {
                  handler(argsQueue);
                } else {
                  // eslint-disable-next-line prefer-spread
                  handler.apply(null, argsQueue);
                }
              } finally {
                argsQueue = [];
              }
            });
          }
        }
      }; // Takes a tied path and checks if it matches with the actual path


      const checkTiedPath = (tiedPath, deps) => {
        const mutationPath = info.path,
              path = mutationPath.length > tiedPath.length ? mutationPath.slice(0, tiedPath.length) : mutationPath,
              tailPath = path.length !== tiedPath.length ? tiedPath.slice(path.length) : []; // Sometimes, we can be caught in the situation when we watch by the path, like, foo.bar.bla,
        // and the mutation occurs on foo.bar.
        // We need to get a value by the tail (.bla) and check that it really was changed.
        // const obj = {foo: {bar: {bla: 1}}}};
        // obj.foo.bar = {bla: 1};

        if (tailPath.length > 0) {
          const tailValue = Object.get(value, tailPath),
                tailOldValue = Object.get(oldValue, tailPath);

          if (tailValue === tailOldValue) {
            return;
          }

          if (!collapse) {
            value = tailValue;
            oldValue = tailOldValue;
          }
        } // The flag indicates that we need to get a real property value from the original object.
        // It makes sense for getters.


        let dynamic = false;

        path: for (let i = 0; i < path.length; i++) {
          const pathVal = path[i],
                tiedPathVal = tiedPath[i];
          const needNormalizeVal = Object.isNumber(pathVal) && tiedPath[isPathParsedFromString] === true && (0, _helpers.isValueCanBeArrayIndex)(tiedPathVal);
          const pathsAreSame = needNormalizeVal ? Number(tiedPathVal) === Number(pathVal) : tiedPathVal === pathVal;

          if (pathsAreSame) {
            continue;
          }

          if (Object.isString(pathVal)) {
            const normalizedTiedPathVal = String(tiedPathVal);

            if (pref) {
              for (let i = 0; i < pref.length; i++) {
                if (pathVal === pref[i] + normalizedTiedPathVal) {
                  dynamic = true;
                  continue path;
                }
              }
            }

            if (post) {
              for (let i = 0; i < post.length; i++) {
                if (pathVal === normalizedTiedPathVal + post[i]) {
                  dynamic = true;
                  continue path;
                }
              }
            }
          }

          if (deps != null) {
            deps: for (let i = 0; i < deps.length; i++) {
              const depPath = deps[i];

              if (!Object.isArray(depPath)) {
                continue;
              }

              const path = info.path.length > depPath.length ? info.path.slice(0, depPath.length) : info.path;

              depsPath: for (let i = 0; i < path.length; i++) {
                const pathVal = path[i],
                      depPathVal = depPath[i];
                const needNormalizeVal = Object.isNumber(pathVal) && depPath[isPathParsedFromString] === true && (0, _helpers.isValueCanBeArrayIndex)(depPathVal);
                const pathsAreSame = needNormalizeVal ? Number(depPathVal) === Number(pathVal) : depPathVal === pathVal;

                if (pathsAreSame) {
                  dynamic = true;
                  continue;
                }

                if (Object.isString(pathVal)) {
                  const normalizedDepPathVal = String(depPathVal);

                  if (pref) {
                    for (let i = 0; i < pref.length; i++) {
                      if (pathVal === pref[i] + normalizedDepPathVal) {
                        dynamic = true;
                        continue depsPath;
                      }
                    }
                  }

                  if (post) {
                    for (let i = 0; i < post.length; i++) {
                      if (pathVal === normalizedDepPathVal + post[i]) {
                        dynamic = true;
                        continue depsPath;
                      }
                    }
                  }
                }

                continue deps;
              }

              break path;
            }
          } // The path doesn't match with a tied path


          return;
        }

        fireMutationEvent(tiedPath, dynamic);
      }; // We watch only the one specified property


      if (normalizedPath) {
        checkTiedPath(normalizedPath, localDeps);
        return;
      }

      fireMutationEvent(); // Check if the mutation matches by prefixes/postfixes with another properties

      if (pref || post) {
        const tiedPath = [];
        let dynamic = false;

        path: for (let i = 0; i < info.path.length; i++) {
          const pathVal = info.path[i];

          if (Object.isString(pathVal)) {
            if (pref) {
              for (let i = 0; i < pref.length; i++) {
                const prefVal = pref[i];

                if (pathVal.startsWith(prefVal)) {
                  dynamic = true;
                  tiedPath.push(pathVal.slice(prefVal.length));
                  continue path;
                }
              }
            }

            if (post) {
              for (let i = 0; i < post.length; i++) {
                const postVal = post[i];

                if (pathVal.endsWith(postVal)) {
                  dynamic = true;
                  tiedPath.push(pathVal.slice(0, -postVal.length));
                  continue path;
                }
              }
            }

            tiedPath.push(pathVal);
          }
        }

        if (dynamic) {
          fireMutationEvent(tiedPath, true);
        }
      } // Check if the mutation matches by dependencies with another properties


      if (deps) {
        for (let i = 0; i < deps.length; i++) {
          const dep = deps[i];
          checkTiedPath(dep[0], dep[1]);
        }
      }
    };
  }

  const watcher = opts.engine.watch(obj, undefined, wrappedHandler, obj[_const.watchHandlers] ?? new Set(), opts);
  const {
    proxy
  } = watcher;

  if (tiedWith && Object.isSimpleObject(unwrappedObj)) {
    tiedWith[_const.watchHandlers] = proxy[_const.watchHandlers];
    tiedWith[_const.toOriginalObject] = proxy[_const.toOriginalObject];

    for (let keys = Object.keys(proxy), i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (Object.hasOwnProperty(tiedWith, key)) {
        continue;
      }

      Object.defineProperty(tiedWith, key, {
        enumerable: true,
        configurable: true,

        get() {
          return proxy[key];
        },

        set(val) {
          proxy[key] = val;
        }

      });
    }
  }

  return watcher;
}
/**
 * The function temporarily mutes all mutation events for the specified proxy object
 *
 * @param obj
 * @example
 * ```js
 * const user = {
 *   name: 'Kobezzza',
 *   skills: {
 *     programming: 80,
 *     singing: 10
 *   }
 * };
 *
 * const {proxy} = watch(user, {immediate: true, deep: true}, (value, oldValue, info) => {
 *   console.log(value, oldValue, info.path);
 * });
 *
 * // 81 80 ['skills', 'programming']
 * proxy.skills.programming++;
 * mute(proxy);
 *
 * // This mutation won't invoke our callback
 * proxy.skills.programming++;
 * ```
 */


function mute(obj) {
  const root = (0, _helpers2.unwrap)(obj[_const.toRootObject] ?? obj);

  if (root) {
    root[_const.muteLabel] = true;
    return true;
  }

  return false;
}
/**
 * The function unmutes all mutation events for the specified proxy object
 *
 * @param obj
 * @example
 * ```js
 * const user = {
 *   name: 'Kobezzza',
 *   skills: {
 *     programming: 80,
 *     singing: 10
 *   }
 * };
 *
 * const {proxy} = watch(user, {immediate: true, deep: true}, (value, oldValue, info) => {
 *   console.log(value, oldValue, info.path);
 * });
 *
 * // 81 80 ['skills', 'programming']
 * proxy.skills.programming++;
 * mute(proxy);
 *
 * // This mutation won't invoke our callback
 * proxy.skills.programming++;
 * unmute(proxy);
 *
 * // 83 82 ['skills', 'programming']
 * proxy.skills.programming++;
 * ```
 */


function unmute(obj) {
  const root = (0, _helpers2.unwrap)(obj[_const.toRootObject] ?? obj);

  if (root) {
    root[_const.muteLabel] = false;
    return true;
  }

  return false;
}
/**
 * Sets a new watchable value for a proxy object by the specified path.
 * The function is actual when using an engine based on accessors to add new properties to the watchable object.
 * Or when you want to restore watching for a property after deleting it.
 *
 * @param obj
 * @param path
 * @param value
 * @param [engine] - watch engine to use
 *
 * @example
 * ```js
 * const user = {
 *   name: 'Kobezzza',
 *   skills: {
 *     programming: 80,
 *     singing: 10
 *   }
 * };
 *
 * const {proxy} = watch(user, {immediate: true, deep: true}, (value, oldValue, info) => {
 *   console.log(value, oldValue, info.path);
 * });
 *
 * // This mutation will invoke our callback
 * set(proxy, 'bla.foo', 1);
 * ```
 */


function set(obj, path, value, handlersOrEngine, engine = _engines.default) {
  let handlers;

  if (Object.isSet(handlersOrEngine)) {
    handlers = handlersOrEngine;
  } else {
    engine = handlersOrEngine ?? engine;
    handlers = obj[_const.watchHandlers];
  }

  engine.set(obj, path, value, handlers);
}
/**
 * Deletes a watchable value from a proxy object by the specified path
 *
 * @param obj
 * @param path
 * @param [engine] - watch engine to use
 *
 * @example
 * ```js
 * const user = {
 *   name: 'Kobezzza',
 *   skills: {
 *     programming: 80,
 *     singing: 10
 *   }
 * };
 *
 * const {proxy} = watch(user, {immediate: true, deep: true}, (value, oldValue, info) => {
 *   console.log(value, oldValue, info.path);
 * });
 *
 * // This mutation will invoke our callback
 * unset(proxy, 'skills.programming');
 *
 * console.log('programming' in proxy.skills === false);
 *
 * // This mutation won't invoke our callback
 * proxy.skills.programming = 80;
 *
 * // Invoke set to register a property to watch.
 * // This mutation will invoke our callback.
 * set(proxy, 'skills.programming', 80)
 *
 * // This mutation will invoke our callback
 * proxy.skills.programming++;
 * ```
 */


function unset(obj, path, handlersOrEngine, engine = _engines.default) {
  let handlers;

  if (Object.isSet(handlersOrEngine)) {
    handlers = handlersOrEngine;
  } else {
    engine = handlersOrEngine ?? engine;
    handlers = obj[_const.watchHandlers];
  }

  engine.unset(obj, path, handlers);
}