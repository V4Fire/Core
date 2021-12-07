"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  local: true,
  asyncLocal: true,
  session: true,
  asyncSession: true,
  has: true,
  get: true,
  set: true,
  remove: true,
  clear: true,
  namespace: true,
  factory: true
};
exports.clear = exports.asyncSession = exports.asyncLocal = void 0;
exports.factory = factory;
exports.set = exports.session = exports.remove = exports.namespace = exports.local = exports.has = exports.get = void 0;

var _json = require("../../core/json");

var _engines = require("../../core/kv-storage/engines");

var _interface = require("../../core/kv-storage/interface");

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

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/kv-storage/README.md]]
 * @packageDocumentation
 */

/**
 * API for synchronous local storage
 *
 * @example
 * ```js
 * local.set('foo', 'bar');
 * local.get('foo'); // 'foo'
 * ```
 */
const local = factory(_engines.syncLocalStorage);
/**
 * API for asynchronous local storage
 *
 * @example
 * ```js
 * asyncLocal.set('foo', 'bar').then(async () => {
 *   console.log(await asyncLocal.get('foo')); // 'foo'
 * });
 * ```
 */

exports.local = local;
const asyncLocal = factory(_engines.asyncLocalStorage, true);
/**
 * API for synchronous session storage
 *
 * @example
 * ```js
 * session.set('foo', 'bar');
 * session.get('foo'); // 'foo'
 * ```
 */

exports.asyncLocal = asyncLocal;
const session = factory(_engines.syncSessionStorage);
/**
 * API for asynchronous session storage
 *
 * @example
 * ```js
 * asyncSession.set('foo', 'bar').then(async () => {
 *   console.log(await asyncSession.get('foo')); // 'foo'
 * });
 * ```
 */

exports.session = session;
const asyncSession = factory(_engines.asyncSessionStorage, true);
/**
 * Alias for a has method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */

exports.asyncSession = asyncSession;
const has = local.has.bind(local);
/**
 * Alias for a get method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */

exports.has = has;
const get = local.get.bind(local);
/**
 * Alias for a set method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */

exports.get = get;
const set = local.set.bind(local);
/**
 * Alias for a remove method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */

exports.set = set;
const remove = local.remove.bind(local);
/**
 * Alias for a clear method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */

exports.remove = remove;
const clear = local.clear.bind(local);
/**
 * Alias for a namespace method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 *
 * @example
 * ```js
 * const storage = namespace('REQUEST_STORAGE');
 * storage.set('foo', 'bar');
 * storage.get('foo'); // 'foo'
 * local.get('foo'); // undefined
 * ```
 */

exports.clear = clear;
const namespace = local.namespace.bind(local);
/**
 * Creates a new kv-storage API with the specified engine
 *
 * @param engine
 * @param async - if true, then the storage is implemented async interface
 *
 * @example
 * ```js
 * const storage = factory(window.localStorage);
 * storage.set('foo', 'bar');
 * storage.get('foo'); // 'foo'
 * ```
 */

exports.namespace = namespace;

function factory(engine, async) {
  let has, get, set, remove, clear, keys;

  try {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    get = engine.getItem ?? engine.get;

    if (Object.isFunction(get)) {
      get = get.bind(engine);
    } else {
      throw new ReferenceError('A method to get a value from the storage is not defined');
    } // eslint-disable-next-line @typescript-eslint/unbound-method


    set = engine.setItem ?? engine.set;

    if (Object.isFunction(set)) {
      set = set.bind(engine);
    } else {
      throw new ReferenceError('A method to set a value to the storage is not defined');
    } // eslint-disable-next-line @typescript-eslint/unbound-method


    remove = engine.removeItem ?? engine.remove ?? engine.delete;

    if (Object.isFunction(remove)) {
      remove = remove.bind(engine);
    } else {
      throw new ReferenceError('A method to remove a value from the storage is not defined');
    }

    {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const _ = engine.exists ?? engine.exist ?? engine.includes ?? engine.has;

      has = Object.isFunction(_) ? _.bind(engine) : undefined;
    }
    {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const _ = engine.clear ?? engine.clearAll ?? engine.truncate;

      clear = Object.isFunction(_) ? _.bind(engine) : undefined;
    }
    {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const _ = engine.keys;
      keys = Object.isFunction(_) ? _.bind(engine) : () => Object.keys(engine);
    }
  } catch {
    throw new TypeError('Invalid storage driver');
  }

  function wrap(val, action) {
    if (async) {
      return (async () => {
        // eslint-disable-next-line require-atomic-updates
        val = await val;

        if (action) {
          return action(val);
        }

        return val;
      })();
    }

    if (action) {
      return action(val);
    }

    return val;
  }

  const obj = {
    has(key, ...args) {
      if (has != null) {
        return wrap(has(key, ...args));
      }

      return wrap(get(key, ...args), v => v != null);
    },

    get(key, ...args) {
      return wrap(get(key, ...args), v => {
        if (v == null || v === 'undefined') {
          return;
        }

        return Object.parse(v, _json.convertIfDate);
      });
    },

    set(key, value, ...args) {
      return wrap(set(key, Object.trySerialize(value), ...args), () => undefined);
    },

    remove(key, ...args) {
      return wrap(remove(key, ...args), () => undefined);
    },

    clear(filter, ...args) {
      if (filter || clear == null) {
        if (async) {
          return (async () => {
            for (const key of await keys()) {
              const el = await obj.get(key);

              if (filter == null || Object.isTruly(filter(el, key))) {
                await remove(key, ...args);
              }
            }
          })();
        }

        for (const key of keys()) {
          const el = obj.get(key);

          if (filter == null || Object.isTruly(filter(el, key))) {
            remove(key, ...args);
          }
        }

        return;
      }

      return wrap(clear(...args), () => undefined);
    },

    namespace(name) {
      const k = key => `${name}.${key}`;

      return {
        has(key, ...args) {
          return obj.has(k(key), ...args);
        },

        get(key, ...args) {
          return obj.get(k(key), ...args);
        },

        set(key, value, ...args) {
          return obj.set(k(key), value, ...args);
        },

        remove(key, ...args) {
          return obj.remove(k(key), ...args);
        },

        clear(filter, ...args) {
          const prfx = `${name}.`;

          if (async) {
            return (async () => {
              for (const key of await keys()) {
                if (!String(key).startsWith(prfx)) {
                  continue;
                }

                const el = await obj.get(key);

                if (filter == null || Object.isTruly(filter(el, key))) {
                  await remove(key, ...args);
                }
              }
            })();
          }

          for (const key of keys()) {
            if (!String(key).startsWith(prfx)) {
              continue;
            }

            const el = obj.get(key);

            if (filter == null || Object.isTruly(filter(el, key))) {
              remove(key, ...args);
            }
          }
        }

      };
    }

  };
  return obj;
}