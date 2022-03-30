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

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/pool/README.md]]
 * @packageDocumentation
 */

/**
 * Implementation of an object pool structure
 * @typeparam T - pool resource
 */
class Pool {
  /**
   * The maximum number of resources that the pool can contain
   */
  maxSize = Infinity;
  /**
   * Number of resources that are stored in the pool
   */

  get size() {
    return this.availableResources.size + this.unavailableResources.size;
  }
  /**
   * Number of available resources that are stored in the pool
   */


  get available() {
    return this.availableResources.size;
  }
  /**
   * A factory to create a new resource for the pool.
   * The function take arguments that are passed to `takeOrCreate`, `borrowAndCreate`, etc.
   */


  /**
   * Event emitter to broadcast pool events
   * @see [[EventEmitter]]
   */
  emitter = new _eventemitter.EventEmitter2();
  /**
   * Store of pool resources
   */

  resourceStore = new Map();
  /**
   * Store of borrowed pool resources
   */

  borrowedResourceStore = new Map();
  /**
   * Set of all available resources
   */

  availableResources = new Set();
  /**
   * Set of all unavailable resources
   */

  unavailableResources = new Set();
  /**
   * Queue of active events
   */

  events = new Map();
  /**
   * Map of active borrow events
   */

  borrowEventsInQueue = new Map();
  /**
   * Handler: taking some resource via `take` methods
   */

  constructor(resourceFactory, argsOrOpts, opts) {
    const p = { ...opts
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
  /**
   * Returns an available resource from the pool.
   * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
   *
   * The returned result is wrapped with a structure that contains methods to release or drop this resource.
   * If the pool is empty, the structure value field will be nullish.
   *
   * @param [args]
   */


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
  /**
   * Returns an available resource from the pool.
   * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
   *
   * The returned result is wrapped with a structure that contains methods to release or drop this resource.
   * If the pool is empty, it creates a new resource and returns it.
   *
   * @param [args]
   */


  takeOrCreate(...args) {
    if (this.canTake(...args) === 0) {
      this.createResource(...args);
    }

    return Object.cast(this.take(...args));
  }
  /**
   * Returns a promise with an available resource from the pull.
   * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
   *
   * The returned result is wrapped with a structure that contains methods to release or drop this resource.
   * If the pool is empty, the promise will wait till it release.
   *
   * @param [args]
   */


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
  /**
   * Borrows an available resource from the pool.
   * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
   *
   * When a resource is borrowed, it won’t be dropped from the pool. I.e. you can share it with other consumers.
   * Mind, you can’t take this resource from the pool when it’s borrowed.
   *
   * The returned result is wrapped with a structure that contains methods to release or drop this resource.
   * If the pool is empty, the structure value field will be nullish.
   *
   * @param [args]
   */


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
  /**
   * Borrows an available resource from the pool.
   * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
   *
   * When a resource is borrowed, it won’t be dropped from the pool. I.e. you can share it with other consumers.
   * Mind, you can’t take this resource from the pool when it’s borrowed.
   *
   * The returned result is wrapped with a structure that contains methods to release or drop this resource.
   * If the pool is empty, it creates a new resource and returns it.
   *
   * @param [args]
   */


  borrowOrCreate(...args) {
    if (!this.canBorrow(...args)) {
      this.createResource(...args);
    }

    return Object.cast(this.borrow(...args));
  }
  /**
   * Returns a promise with a borrowed resource from the pull.
   * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
   *
   * When a resource is borrowed, it won’t be dropped from the pool. I.e. you can share it with other consumers.
   * Mind, you can’t take this resource from the pool when it’s borrowed.
   *
   * The returned result is wrapped with a structure that contains methods to release or drop this resource.
   * If the pool is empty, the promise will wait till it release.
   *
   * @param [args]
   */


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
  /**
   * Clears the pool, i.e. drops all created resource.
   * The method takes arguments that will be provided to hook handlers.
   *
   * @param [args]
   */


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

    return this;
  }
  /**
   * Returns how many elements of the specified kind you can take.
   * The method takes arguments that will be used to calculate a resource hash.
   *
   * @param [args]
   */


  canTake(...args) {
    const array = this.resourceStore.get(this.hashFn(...args));
    return Object.size(array);
  }
  /**
   * Checks if you can borrow a resource.
   * The passed arguments will be used to calculate a resource hash.
   *
   * @param [args]
   */


  canBorrow(...args) {
    const hash = this.hashFn(...args);
    return !(!this.borrowedResourceStore.has(hash) && this.canTake(...args) === 0);
  }
  /**
   * Creates a resource and stores it in the pool.
   * The method takes arguments that will be provided to a resource factory.
   *
   * @param [args]
   */


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
  /**
   * Wraps the specified resource and returns the wrapper
   * @param resource
   */


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
  /**
   * Releases the specified resource.
   * The method takes arguments that will be provided to hook handlers.
   *
   * @param resource
   * @param [args]
   */


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

    return this;
  }

}

exports.default = Pool;