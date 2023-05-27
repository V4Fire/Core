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
class Async extends _events.default {
  wrapDataProvider(provider, opts) {
    const wrappedProvider = Object.create(provider),
      wrappedProviderGroup = opts?.group ?? provider.providerName;
    for (let i = 0; i < _consts.dataProviderMethodsToReplace.length; i++) {
      const methodName = _consts.dataProviderMethodsToReplace[i];
      wrappedProvider[methodName] = (body, opts) => {
        const ownParams = Object.reject(opts, _consts.asyncOptionsKeys),
          asyncParams = Object.select(opts, _consts.asyncOptionsKeys),
          group = `${wrappedProviderGroup}${asyncParams.group != null ? `:${asyncParams.group}` : ''}`;
        if (isQueryMethod(methodName)) {
          return this.request(provider[methodName](body, ownParams), {
            ...asyncParams,
            group
          });
        }
        return this.request(provider[methodName](body, ownParams), {
          ...asyncParams,
          group
        });
      };
    }
    wrappedProvider.emitter = this.wrapEventEmitter(provider.emitter, opts);
    return wrappedProvider;
    function isQueryMethod(name) {
      return ['get', 'peek'].includes(name);
    }
  }
  wrapEventEmitter(emitter, opts) {
    const wrappedEmitter = Object.create(emitter);
    wrappedEmitter.on = (event, fn, ...params) => {
      if (!Object.isFunction(fn)) {
        throw new TypeError('Wrapped emitters methods `on, addEventListener, addListener` accept only a function as the second parameter');
      }
      return this.on(emitter, event, fn, ...normalizeAdditionalArgs(params));
    };
    wrappedEmitter.addEventListener = wrappedEmitter.on;
    wrappedEmitter.addListener = wrappedEmitter.on;
    wrappedEmitter.once = (event, fn, ...params) => this.once(emitter, event, fn, ...normalizeAdditionalArgs(params));
    wrappedEmitter.promisifyOnce = (event, ...params) => this.promisifyOnce(emitter, event, ...normalizeAdditionalArgs(params));
    const wrapOff = originalMethod => (link, ...args) => {
      if (link == null || typeof link !== 'object' || args.length > 0) {
        return Object.isFunction(originalMethod) ? originalMethod.call(emitter, link, ...args) : null;
      }
      return this.off(link);
    };
    wrappedEmitter.off = wrapOff(emitter.off);
    wrappedEmitter.removeEventListener = wrapOff(emitter.removeEventListener);
    wrappedEmitter.removeListener = wrapOff(emitter.removeListener);
    wrappedEmitter.emit = (event, ...args) => {
      for (let i = 0; i < _consts.emitLikeEvents.length; i++) {
        const key = _consts.emitLikeEvents[i],
          property = emitter[key];
        if (Object.isFunction(property)) {
          return property.call(emitter, event, ...args);
        }
      }
    };
    return wrappedEmitter;
    function normalizeAdditionalArgs(params) {
      if (Object.isPlainObject(params[0])) {
        const ownParam = Object.reject(params[0], _consts.asyncOptionsKeys),
          asyncParam = Object.select(params[0], _consts.asyncOptionsKeys);
        return [{
          ...asyncParam,
          group: [opts?.group, asyncParam.group].filter(Boolean).join(':')
        }, ownParam, ...params.slice(1)];
      }
      return [opts?.group != null ? {
        group: opts.group
      } : {}, ...params];
    }
  }
  wrapStorage(storage, opts) {
    const globalGroup = opts?.group,
      wrappedStorage = Object.create(storage);
    wrappedStorage.has = (key, ...args) => {
      const [asyncOpts, params] = separateArgs(args);
      return this.promise(storage.has(key, ...params), asyncOpts);
    };
    wrappedStorage.get = (key, ...args) => {
      const [asyncOpts, params] = separateArgs(args);
      return this.promise(storage.get(key, ...params), asyncOpts);
    };
    wrappedStorage.set = (key, value, ...args) => {
      const [asyncOpts, params] = separateArgs(args);
      return this.promise(storage.set(key, value, ...params), asyncOpts);
    };
    wrappedStorage.remove = (key, ...args) => {
      const [asyncOpts, params] = separateArgs(args);
      return this.promise(storage.remove(key, ...params), asyncOpts);
    };
    wrappedStorage.clear = (filter, ...args) => {
      if (Object.isPlainObject(filter)) {
        filter = undefined;
        args = [filter];
      }
      const [asyncOpts, params] = separateArgs(args);
      return this.promise(storage.clear(filter, ...params), asyncOpts);
    };
    if ('namespace' in storage) {
      wrappedStorage.namespace = (name, opts) => {
        const [asyncOpts] = separateArgs([opts]);
        const storageNamespace = storage.namespace(name);
        return this.wrapStorage(storageNamespace, asyncOpts);
      };
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