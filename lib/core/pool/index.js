"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _eventemitter = require("eventemitter2");
var _event = require("../../core/event");
var _sync = _interopRequireDefault(require("../../core/promise/sync"));
var _uuid = require("../../core/uuid");
var _queue = require("../../core/queue");
var _const = require("../../core/pool/const");
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
var _interface = require("../../core/pool/interface");
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
class Pool {
  maxSize = Infinity;
  get size() {
    return this.availableResources.size + this.unavailableResources.size;
  }
  get available() {
    return this.availableResources.size;
  }
  emitter = new _eventemitter.EventEmitter2();
  resourceStore = new Map();
  borrowedResourceStore = new Map();
  availableResources = new Set();
  unavailableResources = new Set();
  events = new Map();
  borrowEventsInQueue = new Map();
  constructor(resourceFactory, argsOrOpts, opts) {
    const p = {
      ...opts
    };
    let args = [];
    if (Object.isArray(argsOrOpts) || Object.isFunction(argsOrOpts)) {
      args = argsOrOpts;
    } else if (Object.isDictionary(argsOrOpts)) {
      Object.assign(p, argsOrOpts);
    }
    Object.assign(this, Object.reject(p, 'size'));
    this.hashFn ??= () => '[[DEFAULT]]';
    this.resourceFactory = resourceFactory;
    const size = p.size ?? 0;
    for (let i = 0; i < size; i++) {
      this.createResource(...(Object.isFunction(args) ? args(i) : args));
    }
  }
  take(...args) {
    const resource = this.resourceStore.get(this.hashFn(...args))?.pop();
    if (resource == null) {
      return this.wrapResource(null);
    }
    resource[_const.borrowCounter]++;
    this.availableResources.delete(resource);
    this.unavailableResources.add(resource);
    if (this.onTake != null) {
      this.onTake(resource, this, ...args);
    }
    return this.wrapResource(resource);
  }
  takeOrCreate(...args) {
    if (this.canTake(...args) === 0) {
      this.createResource(...args);
    }
    return Object.cast(this.take(...args));
  }
  takeOrWait(...args) {
    const event = this.hashFn(...args),
      id = (0, _uuid.serialize)((0, _uuid.generate)());
    return new _sync.default(r => {
      if (this.canTake(...args) !== 0) {
        r(this.take(...args));
        return;
      }
      let queue = this.events.get(event);
      if (queue == null) {
        queue = new _queue.Queue();
        this.events.set(event, queue);
      }
      queue.push(id);
      r((0, _event.resolveAfterEvents)(this.emitter, id).then(() => this.take(...args)));
    });
  }
  borrow(...args) {
    const hash = this.hashFn(...args);
    let resource = this.borrowedResourceStore.get(hash);
    resource = resource ?? this.resourceStore.get(hash)?.pop();
    if (resource == null) {
      return this.wrapResource(null);
    }
    this.borrowedResourceStore.set(hash, resource);
    resource[_const.borrowCounter]++;
    if (this.onBorrow != null) {
      this.onBorrow(resource, this, ...args);
    }
    return this.wrapResource(resource);
  }
  borrowOrCreate(...args) {
    if (!this.canBorrow(...args)) {
      this.createResource(...args);
    }
    return Object.cast(this.borrow(...args));
  }
  borrowOrWait(...args) {
    const event = this.hashFn(...args);
    let id = (0, _uuid.serialize)((0, _uuid.generate)());
    return new _sync.default(r => {
      if (this.canBorrow(...args)) {
        r(this.borrow(...args));
        return;
      }
      const events = this.borrowEventsInQueue.get(event);
      if (events == null) {
        if (!this.events.has(event)) {
          this.events.set(event, new _queue.Queue());
        }
        this.events.get(event)?.push(id);
        this.borrowEventsInQueue.set(event, id);
      } else {
        id = events;
      }
      r((0, _event.resolveAfterEvents)(this.emitter, id).then(() => {
        this.borrowEventsInQueue.delete(event);
        return this.borrow(...args);
      }));
    });
  }
  clear(...args) {
    const destructor = this.resourceDestructor;
    if (destructor != null) {
      this.availableResources.forEach(resource => {
        destructor(resource);
      });
      this.unavailableResources.forEach(resource => {
        destructor(resource);
      });
    }
    this.resourceStore.clear();
    this.borrowedResourceStore.clear();
    this.availableResources.clear();
    this.unavailableResources.clear();
    if (this.onClear != null) {
      this.onClear(this, ...args);
    }
  }
  canTake(...args) {
    const array = this.resourceStore.get(this.hashFn(...args));
    return Object.size(array);
  }
  canBorrow(...args) {
    const hash = this.hashFn(...args);
    return !(!this.borrowedResourceStore.has(hash) && this.canTake(...args) === 0);
  }
  createResource(...args) {
    const hash = this.hashFn(...args);
    if (this.maxSize <= this.size) {
      throw new Error('The pool contains too many resources');
    }
    let store = this.resourceStore.get(hash);
    if (store == null) {
      store = [];
      this.resourceStore.set(hash, store);
    }
    const resource = this.resourceFactory(...args);
    Object.defineProperty(resource, _const.hashVal, {
      configurable: true,
      writable: true,
      value: hash
    });
    Object.defineProperty(resource, _const.borrowCounter, {
      configurable: true,
      writable: true,
      value: 0
    });
    store.push(resource);
    this.availableResources.add(resource);
    return resource;
  }
  wrapResource(resource) {
    let released = false;
    return {
      value: resource,
      free: (...args) => {
        if (released) {
          return;
        }
        released = true;
        if (resource != null) {
          this.free(resource, ...args);
        }
      },
      destroy: () => {
        if (released) {
          return;
        }
        released = true;
        if (resource != null) {
          const {
            onFree
          } = this;
          this.onFree = undefined;
          this.free(resource);
          this.availableResources.delete(resource);
          this.onFree = onFree;
          if (resource[_const.borrowCounter] === 0) {
            this.resourceStore.get(resource[_const.hashVal])?.pop();
            this.resourceDestructor?.(resource);
          }
        }
      }
    };
  }
  free(resource, ...args) {
    resource[_const.borrowCounter]--;
    this.unavailableResources.delete(resource);
    this.availableResources.add(resource);
    if (resource[_const.borrowCounter] === 0 && this.borrowedResourceStore.get(resource[_const.hashVal]) === resource) {
      this.borrowedResourceStore.delete(resource[_const.hashVal]);
    }
    if (resource[_const.borrowCounter] === 0) {
      this.resourceStore.get(resource[_const.hashVal])?.push(resource);
    }
    const event = this.events.get(resource[_const.hashVal])?.pop();
    if (event != null) {
      this.emitter.emit(event);
    }
    if (this.onFree != null) {
      this.onFree(resource, this, ...args);
    }
  }
}
exports.default = Pool;