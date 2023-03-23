"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

var _events = _interopRequireWildcard(require("../../../../core/async/modules/events"));

Object.keys(_events).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _events[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _events[key];
    }
  });
});

var _consts = require("../../../../core/async/modules/wrappers/consts");

Object.keys(_consts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _consts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _consts[key];
    }
  });
});

var _interface = require("../../../../core/async/interface");

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
 * [[include:core/async/modules/wrappers/README.md]]
 * @packageDocumentation
 */
class Async extends _events.default {
  /**
   * The wrapper takes a link to the "raw" data provider and returns a new object that based
   * on the original, but all asynchronous methods and properties are wrapped by Async.
   * Notice, the wrapped methods can take additional Async parameters, like group or label.
   * If you don't provide a group, it will be taken from the provider name.
   *
   * @param provider
   * @param [opts] - additional options for the wrapper
   *
   * @example
   * ```js
   * import Async from '../../../../core/async';
   * import Provider, { provider } from '../../../../core/data';
   *
   * @provider('api')
   * export default class User extends Provider {
   *   baseURL = 'user/:id';
   * }
   *
   * const
   *   $a = new Async(),
   *   wrappedProvider = $a.wrapDataProvider(new User());
   *
   * wrappedProvider.get({uuid: 1}).then((res) => {
   *   console.log(res);
   * });
   *
   * // By default, all wrapped methods have a group name that is equal to the provider name.
   * // So we can use it to clear or suspend requests, etc.
   * $a.clearAll({group: 'api.User'})
   *
   * wrappedProvider.upd({uuid: 1}, {
   *   // All wrapped methods can take additional Async parameters as the second argument: `group`, `label` and `join`
   *   group: 'bla',
   *   label: 'foo',
   *   join: true,
   *
   *   // Also, the second argument of the wrapped method can take the original parameters from a provider
   *   headers: {
   *     'X-Foo': '1'
   *   }
   *
   * }).then((res) => {
   *   console.log(res);
   * });
   *
   * // If we are providing a group to the method, it will be joined with the global group by using the `:` character
   * $a.suspendAll({group: 'api.User:bla'});
   *
   * // Obviously, we can use a group as RegExp
   * $a.muteAll({group: /api\.User/});
   *
   * // We can use any methods or properties from the original data provider
   * wrappedProvider.dropCache();
   * ```
   */
  wrapDataProvider(provider, opts) {
    const wrappedProvider = Object.create(provider),
          wrappedProviderGroup = opts?.group ?? provider.providerName;

    for (let i = 0; i < _consts.dataProviderMethodsToReplace.length; i++) {
      const methodName = _consts.dataProviderMethodsToReplace[i];
      Object.defineProperty(wrappedProvider, methodName, {
        configurable: true,
        writable: true,
        value: (body, opts) => {
          const ownParams = Object.reject(opts, _consts.asyncOptionsKeys),
                asyncParams = Object.select(opts, _consts.asyncOptionsKeys),
                group = `${wrappedProviderGroup}${asyncParams.group != null ? `:${asyncParams.group}` : ''}`;

          if (isQueryMethod(methodName)) {
            return this.request(provider[methodName](body, ownParams), { ...asyncParams,
              group
            });
          }

          return this.request(provider[methodName](body, ownParams), { ...asyncParams,
            group
          });
        }
      });
    }

    Object.defineProperty(wrappedProvider, 'emitter', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: this.wrapEventEmitter(provider.emitter, opts)
    });
    return wrappedProvider;

    function isQueryMethod(name) {
      return ['get', 'peek'].includes(name);
    }
  }
  /**
   * The wrapper takes a link to the "raw" event emitter and returns a new object that based
   * on the original, but all asynchronous methods and properties are wrapped by Async.
   * Notice, the wrapped methods can take additional Async parameters, like group or label.
   * In addition, the wrapper adds new methods, like "on" or "off", to make the emitter API more standard.
   *
   * @param emitter
   * @param [opts] - additional options for the wrapper
   *
   * @example
   * ```js
   * import Async from '../../../../core/async';
   *
   * const
   *   $a = new Async(),
   *   wrappedEventEmitter = $a.wrapEventEmitter(window);
   *
   * const handler = () => console.log('scroll event');
   *
   * // We can safely listen to emitter events,
   * // cause all emitter methods, like `addListener` or `on` are wrapped by Async.
   * const id = wrappedEventEmitter.addEventListener('scroll', handler, {
   *   // Notice, the third argument can take Async parameters in addition to the native emitter parameters
   *   capture: true,
   *   label: 'label'
   * });
   *
   * // The wrapper preserves the original API of emitter methods, so we can call something like this
   * wrappedEventEmitter.removeEventListener('scroll', handler);
   *
   * // Finally, the wrapper adds a bunch of standard methods to the emitter, like `on`, `once`, and other stuff.
   * // We can use their instead of the original methods to make our code more universal.
   * wrappedEventEmitter.once('resize', (e) => {
   *   console.log(e);
   * }, {group: 'resizers'});
   *
   * $a.muteAll({group: 'resizers'});
   *
   * // We can use any methods or properties from the original emitter
   * console.log(wrappedEventEmitter.name); // window.name
   * ```
   */


  wrapEventEmitter(emitter, opts) {
    const wrappedEmitter = Object.create(emitter);
    Object.defineProperty(wrappedEmitter, 'on', {
      configurable: true,
      writable: true,
      value: (event, fn, ...params) => {
        if (!Object.isFunction(fn)) {
          throw new TypeError('Wrapped emitters methods `on, addEventListener, addListener` accept only a function as the second parameter');
        }

        return this.on(emitter, event, fn, ...normalizeAdditionalArgs(params));
      }
    });
    Object.defineProperty(wrappedEmitter, 'addEventListener', {
      configurable: true,
      writable: true,
      value: wrappedEmitter.on
    });
    Object.defineProperty(wrappedEmitter, 'addListener', {
      configurable: true,
      writable: true,
      value: wrappedEmitter.on
    });
    Object.defineProperty(wrappedEmitter, 'once', {
      configurable: true,
      writable: true,
      value: (event, fn, ...params) => this.once(emitter, event, fn, ...normalizeAdditionalArgs(params))
    });
    Object.defineProperty(wrappedEmitter, 'promisifyOnce', {
      configurable: true,
      writable: true,
      value: (event, ...params) => this.promisifyOnce(emitter, event, ...normalizeAdditionalArgs(params))
    });

    const wrapOff = originalMethod => (link, ...args) => {
      if (link != null && typeof link !== 'object' || args.length > 0) {
        return Object.isFunction(originalMethod) ? originalMethod.call(emitter, link, ...args) : null;
      }

      return this.off(link);
    };

    Object.defineProperty(wrappedEmitter, 'off', {
      configurable: true,
      writable: true,
      value: wrapOff(emitter.off)
    });
    Object.defineProperty(wrappedEmitter, 'removeEventListener', {
      configurable: true,
      writable: true,
      value: wrapOff(emitter.removeEventListener)
    });
    Object.defineProperty(wrappedEmitter, 'removeListener', {
      configurable: true,
      writable: true,
      value: wrapOff(emitter.removeListener)
    });
    Object.defineProperty(wrappedEmitter, 'emit', {
      configurable: true,
      writable: true,
      value: (event, ...args) => {
        for (let i = 0; i < _consts.emitLikeEvents.length; i++) {
          const key = _consts.emitLikeEvents[i],
                property = emitter[key];

          if (Object.isFunction(property)) {
            return property.call(emitter, event, ...args);
          }
        }
      }
    });
    return wrappedEmitter;

    function normalizeAdditionalArgs(params) {
      if (Object.isPlainObject(params[0])) {
        const ownParam = Object.reject(params[0], _consts.asyncOptionsKeys),
              asyncParam = Object.select(params[0], _consts.asyncOptionsKeys);
        return [{ ...asyncParam,
          group: [opts?.group, asyncParam.group].filter(Boolean).join(':')
        }, ownParam, ...params.slice(1)];
      }

      return [opts?.group != null ? {
        group: opts.group
      } : {}, ...params];
    }
  }
  /**
   * The wrapper takes a link to the "raw" asynchronous storage and returns a new object that based
   * on the original, but all asynchronous methods and properties are wrapped by Async.
   * Notice, the wrapped methods can take additional Async parameters, like group or label.
   *
   * @param storage
   * @param opts
   *
   * @example
   * ```js
   * import Async from '../../../../core/async';
   * import { asyncLocal } from '../../../../core/kv-storage';
   *
   * const
   *   $a = new Async(),
   *   wrappedStorage = $a.wrapStorage(asyncLocal, {group: 'bar'});
   *
   * wrappedStorage.set('someKey', 'someValue', {
   *   // If we are providing a group to the method, it will be joined with the global group by using the `:` character
   *   group: 'bla',
   *   label: 'foo',
   *   join: true,
   * }).then(async () => {
   *   console.log(await wrappedStorage.get('someKey') === 'someValue');
   * });
   *
   * $a.suspendAll({group: 'bar:bla'});
   *
   * // We can provide own global group to namespace, it will be joined with the parent's global group
   * const blaStore = wrappedStorage.namespace('[[BLA]]', {group: 'bla'});
   *
   * blaStore.clear({group: 'foo'});
   *
   * $a.muteAll({group: 'bar:bla:foo'});
   * ```
   */


  wrapStorage(storage, opts) {
    const globalGroup = opts?.group,
          wrappedStorage = Object.create(storage);
    Object.defineProperty(wrappedStorage, 'has', {
      configurable: true,
      writable: true,
      value: (key, ...args) => {
        const [asyncOpts, params] = separateArgs(args);
        return this.promise(storage.has(key, ...params), asyncOpts);
      }
    });
    Object.defineProperty(wrappedStorage, 'get', {
      configurable: true,
      writable: true,
      value: (key, ...args) => {
        const [asyncOpts, params] = separateArgs(args);
        return this.promise(storage.get(key, ...params), asyncOpts);
      }
    });
    Object.defineProperty(wrappedStorage, 'set', {
      configurable: true,
      writable: true,
      value: (key, value, ...args) => {
        const [asyncOpts, params] = separateArgs(args);
        return this.promise(storage.set(key, value, ...params), asyncOpts);
      }
    });
    Object.defineProperty(wrappedStorage, 'remove', {
      configurable: true,
      writable: true,
      value: (key, ...args) => {
        const [asyncOpts, params] = separateArgs(args);
        return this.promise(storage.remove(key, ...params), asyncOpts);
      }
    });
    Object.defineProperty(wrappedStorage, 'clear', {
      configurable: true,
      writable: true,
      value: (filter, ...args) => {
        if (Object.isPlainObject(filter)) {
          filter = undefined;
          args = [filter];
        }

        const [asyncOpts, params] = separateArgs(args);
        return this.promise(storage.clear(filter, ...params), asyncOpts);
      }
    });

    if ('namespace' in storage) {
      Object.defineProperty(wrappedStorage, 'namespace', {
        configurable: true,
        writable: true,
        value: (name, opts) => {
          const [asyncOpts] = separateArgs([opts]);
          const storageNamespace = storage.namespace(name);
          return this.wrapStorage(storageNamespace, asyncOpts);
        }
      });
    }

    return wrappedStorage;

    function separateArgs(args) {
      const lastArg = args.pop();

      if (!Object.isDictionary(lastArg)) {
        return [globalGroup != null ? {
          group: globalGroup
        } : {}, [...args, lastArg]];
      }

      const ownParams = Object.reject(lastArg, _consts.asyncOptionsKeys),
            asyncParams = Object.select(lastArg, _consts.asyncOptionsKeys),
            group = [globalGroup, asyncParams.group].filter(Boolean).join(':');

      if (group !== '') {
        asyncParams.group = group;
      }

      if (Object.keys(ownParams).length !== 0) {
        args.push(ownParams);
      }

      return [asyncParams, args];
    }
  }

}

exports.default = Async;