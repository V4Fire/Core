"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));

var _functools = require("../../../../core/functools");

var _const = require("../../../../core/async/const");

var _const2 = require("../../../../core/async/modules/base/const");

Object.keys(_const2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _const2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _const2[key];
    }
  });
});

var _helpers = require("../../../../core/async/modules/base/helpers");

Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _helpers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _helpers[key];
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

var _dec, _dec2, _dec3, _dec4, _class;

let Async = (_dec = (0, _functools.deprecated)({
  renamedTo: 'getCache'
}), _dec2 = (0, _functools.deprecated)({
  renamedTo: 'registerTask'
}), _dec3 = (0, _functools.deprecated)({
  renamedTo: 'cancelTask'
}), _dec4 = (0, _functools.deprecated)({
  renamedTo: 'markTask'
}), (_class = class Async {
  /**
   * Map of namespaces for async operations
   */
  static namespaces = _const.namespaces;
  /**
   * @deprecated
   * @see Async.namespaces
   */

  static linkNames = _const.namespaces;
  /**
   * The lock status.
   * If true, then all new tasks won't be registered.
   */

  locked = false;
  /**
   * Cache for async operations
   */

  cache = Object.createDict();
  /**
   * Cache for initialized workers
   */

  workerCache = new WeakMap();
  /**
   * Map for task identifiers
   */

  idsMap = new WeakMap();
  /**
   * Context of applying for async handlers
   */

  /**
   * Set of used async namespaces
   */
  usedNamespaces = new Set();
  /**
   * Link to `Async.namespaces`
   */

  get namespaces() {
    const constr = this.constructor;

    if (constr.namespaces !== constr.linkNames) {
      return constr.linkNames;
    }

    return constr.namespaces;
  }
  /**
   * @deprecated
   * @see [[Async.namespaces]]
   */


  get linkNames() {
    (0, _functools.deprecate)({
      name: 'linkNames',
      type: 'accessor',
      renamedTo: 'namespaces'
    });
    return this.namespaces;
  }
  /**
   * @param [ctx] - context of applying for async handlers
   */


  constructor(ctx) {
    this.ctx = ctx ?? Object.cast(this);
    this.context = this.ctx;
  }
  /**
   * Clears all async tasks
   * @param [opts] - additional options for the operation
   */


  clearAll(opts) {
    for (let o = this.usedNamespaces.values(), el = o.next(); !el.done; el = o.next()) {
      const key = el.value,
            alias = `clear-${this.namespaces[key]}`.camelize(false);

      if (Object.isFunction(this[alias])) {
        this[alias](opts);
      } else if (!_const2.isPromisifyNamespace.test(key)) {
        throw new ReferenceError(`The method "${alias}" is not defined`);
      }
    }

    return this;
  }
  /**
   * Mutes all async tasks
   * @param [opts] - additional options for the operation
   */


  muteAll(opts) {
    for (let o = this.usedNamespaces.values(), el = o.next(); !el.done; el = o.next()) {
      const key = el.value,
            alias = `mute-${this.namespaces[key]}`.camelize(false);

      if (!_const2.isPromisifyNamespace.test(key) && Object.isFunction(this[alias])) {
        this[alias](opts);
      }
    }

    return this;
  }
  /**
   * Unmutes all async tasks
   * @param [opts] - additional options for the operation
   */


  unmuteAll(opts) {
    for (let o = this.usedNamespaces.values(), el = o.next(); !el.done; el = o.next()) {
      const key = el.value,
            alias = `unmute-${this.namespaces[key]}`.camelize(false);

      if (!_const2.isPromisifyNamespace.test(key) && Object.isFunction(this[alias])) {
        this[alias](opts);
      }
    }

    return this;
  }
  /**
   * Suspends all async tasks
   * @param [opts] - additional options for the operation
   */


  suspendAll(opts) {
    for (let o = this.usedNamespaces.values(), el = o.next(); !el.done; el = o.next()) {
      const key = el.value,
            alias = `suspend-${this.namespaces[key]}`.camelize(false);

      if (!_const2.isPromisifyNamespace.test(key) && Object.isFunction(this[alias])) {
        this[alias](opts);
      }
    }

    return this;
  }
  /**
   * Unsuspends all async tasks
   * @param [opts] - additional options for the operation
   */


  unsuspendAll(opts) {
    for (let o = this.usedNamespaces.values(), el = o.next(); !el.done; el = o.next()) {
      const key = el.value,
            alias = `unsuspend-${this.namespaces[key]}`.camelize(false);

      if (!_const2.isPromisifyNamespace.test(key) && Object.isFunction(this[alias])) {
        this[alias](opts);
      }
    }

    return this;
  }
  /**
   * Returns a cache object by the specified name
   *
   * @param name
   * @param [promise] - if true, the namespace is marked as promisified
   */


  getCache(name, promise) {
    name = promise ? `${name}Promise` : name;
    return this.cache[name] = this.cache[name] ?? {
      root: {
        labels: Object.createDict(),
        links: new Map()
      },
      groups: Object.createDict()
    };
  }
  /**
   * @deprecated
   * @see [[Async.getCache]]
   */


  initCache(name, promise) {
    return this.getCache(name, promise);
  }
  /**
   * Registers the specified async task
   * @param task
   */


  registerTask(task) {
    if (this.locked) {
      return null;
    }

    this.usedNamespaces.add(task.name);
    const {
      ctx
    } = this;
    const baseCache = this.getCache(task.name, task.promise),
          callable = task.callable ?? task.needCall;
    let cache;

    if (task.group != null) {
      cache = baseCache.groups[task.group] ?? {
        labels: Object.createDict(),
        links: new Map()
      };
      baseCache.groups[task.group] = cache;
    } else {
      cache = baseCache.root;
    }

    const {
      label
    } = task,
          {
      labels,
      links
    } = cache,
          {
      links: baseLinks
    } = baseCache.root;
    const labelCache = label != null ? labels[label] : null;

    if (labelCache != null && task.join === true) {
      const mergeHandlers = Array.concat([], task.onMerge),
            link = links.get(labelCache);

      for (let i = 0; i < mergeHandlers.length; i++) {
        mergeHandlers[i].call(ctx, link);
      }

      return labelCache;
    }

    const normalizedObj = callable && Object.isFunction(task.obj) ? task.obj.call(ctx) : task.obj;
    let wrappedObj = normalizedObj,
        taskId = normalizedObj;

    if (!task.periodic || Object.isFunction(wrappedObj)) {
      wrappedObj = (...args) => {
        const link = links.get(taskId);

        if (link?.muted === true) {
          const mutedCallHandlers = Array.concat([], task.onMutedCall);

          for (let i = 0; i < mutedCallHandlers.length; i++) {
            mutedCallHandlers[i].call(ctx, link);
          }
        }

        if (!link || link.muted) {
          return;
        }

        if (!task.periodic) {
          if (link.paused) {
            link.muted = true;
          } else {
            link.unregister();
          }
        }

        const invokeHandlers = (i = 0) => (...args) => {
          const fns = link.onComplete;

          if (Object.isArray(fns)) {
            for (let j = 0; j < fns.length; j++) {
              const fn = fns[j];

              if (Object.isFunction(fn)) {
                fn.apply(ctx, args);
              } else {
                fn[i].apply(ctx, args);
              }
            }
          }
        };

        const needDelete = !task.periodic && link.paused;

        const exec = () => {
          if (needDelete) {
            link.unregister();
          }

          let res = normalizedObj;

          if (Object.isFunction(normalizedObj)) {
            res = normalizedObj.apply(ctx, args);
          }

          if (Object.isPromiseLike(res)) {
            res.then(invokeHandlers(), invokeHandlers(1));
          } else {
            invokeHandlers()(...args);
          }

          return res;
        };

        if (link.paused) {
          link.queue.push(exec);
          return;
        }

        return exec();
      };
    }

    if (task.wrapper) {
      const link = task.wrapper.apply(null, [wrappedObj].concat(callable ? taskId : [], task.args));

      if (task.linkByWrapper) {
        taskId = link;
      }
    }

    const link = {
      id: taskId,
      obj: task.obj,
      objName: task.obj.name,
      group: task.group,
      label: task.label,
      paused: false,
      muted: false,
      queue: [],
      clearFn: task.clearFn,
      onComplete: [],
      onClear: Array.concat([], task.onClear),
      unregister: () => {
        links.delete(taskId);
        baseCache.root.links.delete(taskId);

        if (label != null && labels[label] != null) {
          labels[label] = undefined;
        }
      }
    };

    if (labelCache != null) {
      this.cancelTask({ ...task,
        replacedBy: link,
        reason: 'collision'
      });
    }

    links.set(taskId, link);

    if (links !== baseLinks) {
      baseLinks.set(taskId, link);
    }

    if (label != null) {
      labels[label] = taskId;
    }

    return taskId;
  }
  /**
   * @deprecated
   * @see [[Async.registerTask]]
   */


  setAsync(task) {
    return this.registerTask(task);
  }
  /**
   * Cancels a task (or a group of tasks) from the specified namespace
   *
   * @param task - operation options or task link
   * @param [name] - namespace of the operation
   */


  cancelTask(task, name) {
    task = task != null ? this.idsMap.get(task) ?? task : task;
    let p;

    if (name != null) {
      if (task === undefined) {
        return this.cancelTask({
          name,
          reason: 'all'
        });
      }

      p = Object.isPlainObject(task) ? { ...task,
        name
      } : {
        name,
        id: task
      };
    } else {
      p = task ?? {};
    }

    const baseCache = this.getCache(p.name, p.promise);
    let cache;

    if (p.group != null) {
      if (Object.isRegExp(p.group)) {
        const obj = baseCache.groups,
              keys = Object.keys(obj);

        for (let i = 0; i < keys.length; i++) {
          const group = keys[i];

          if (p.group.test(group)) {
            this.cancelTask({ ...p,
              group,
              reason: 'rgxp'
            });
          }
        }

        return this;
      }

      const group = baseCache.groups[p.group];

      if (group == null) {
        return this;
      }

      cache = group;

      if (p.reason == null) {
        p.reason = 'group';
      }
    } else {
      cache = baseCache.root;
    }

    const {
      labels,
      links
    } = cache;

    if (p.label != null) {
      const tmp = labels[p.label];

      if (p.id != null && p.id !== tmp) {
        return this;
      }

      p.id = tmp;

      if (p.reason == null) {
        p.reason = 'label';
      }
    }

    if (p.reason == null) {
      p.reason = 'id';
    }

    if (p.id != null) {
      const link = links.get(p.id);

      if (link != null) {
        const skipZombie = link.group != null && p.reason === 'all' && _const2.isZombieGroup.test(link.group);

        if (skipZombie) {
          return this;
        }

        link.unregister();
        const ctx = { ...p,
          link,
          type: 'clearAsync'
        };
        const clearHandlers = link.onClear,
              {
          clearFn
        } = link;

        for (let i = 0; i < clearHandlers.length; i++) {
          clearHandlers[i].call(this.ctx, ctx);
        }

        if (clearFn != null && !p.preventDefault) {
          clearFn(link.id, ctx);
        }
      }
    } else {
      for (let o = links.values(), el = o.next(); !el.done; el = o.next()) {
        this.cancelTask({ ...p,
          id: el.value.id
        });
      }
    }

    return this;
  }
  /**
   * @deprecated
   * @see [[Async.cancelTask]]
   */


  clearAsync(opts, name) {
    return this.cancelTask(opts, name);
  }
  /**
   * Marks a task (or a group of tasks) from the namespace by the specified label
   *
   * @param label
   * @param task - operation options or a link to the task
   * @param [name] - namespace of the operation
   */


  markTask(label, task, name) {
    task = task != null ? this.idsMap.get(task) ?? task : task;
    let p;

    if (name != null) {
      if (task === undefined) {
        return this.markTask(label, {
          name,
          reason: 'all'
        });
      }

      p = Object.isPlainObject(task) ? { ...task,
        name
      } : {
        name,
        id: task
      };
    } else {
      p = task ?? {};
    }

    const baseCache = this.getCache(p.name);
    let cache;

    if (p.group != null) {
      if (Object.isRegExp(p.group)) {
        const obj = baseCache.groups,
              keys = Object.keys(obj);

        for (let i = 0; i < keys.length; i++) {
          const group = keys[i];

          if (p.group.test(group)) {
            this.markTask(label, { ...p,
              group,
              reason: 'rgxp'
            });
          }
        }

        return this;
      }

      const groupCache = baseCache.groups[p.group];

      if (groupCache == null) {
        return this;
      }

      cache = groupCache;
    } else {
      cache = baseCache.root;
    }

    const {
      labels,
      links
    } = cache;

    if (p.label != null) {
      const tmp = labels[p.label];

      if (p.id != null && p.id !== tmp) {
        return this;
      }

      p.id = tmp;

      if (p.reason == null) {
        p.reason = 'label';
      }
    }

    if (p.reason == null) {
      p.reason = 'id';
    }

    if (p.id != null) {
      const link = links.get(p.id);

      if (link) {
        const skipZombie = link.group != null && p.reason === 'all' && _const2.isZombieGroup.test(link.group);

        if (skipZombie) {
          return this;
        }

        if (label === '!paused') {
          for (let o = link.queue, i = 0; i < o.length; i++) {
            o[i]();
          }

          link.muted = false;
          link.paused = false;
          link.queue = [];
        } else if (label.startsWith('!')) {
          link[label.slice(1)] = false;
        } else {
          link[label] = true;
        }
      }
    } else {
      const values = links.values();

      for (let el = values.next(); !el.done; el = values.next()) {
        this.markTask(label, { ...p,
          id: el.value.id
        });
      }
    }

    return this;
  }
  /**
   * @deprecated
   * @see [[Async.markTask]]
   */


  markAsync(label, opts, name) {
    return this.markTask(label, opts, name);
  }
  /**
   * Marks all async tasks from the namespace by the specified label
   *
   * @param label
   * @param opts - operation options
   */


  markAllTasks(label, opts) {
    this.markTask(label, opts);
    return this;
  }

}, ((0, _applyDecoratedDescriptor2.default)(_class.prototype, "initCache", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "initCache"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "setAsync", [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, "setAsync"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "clearAsync", [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, "clearAsync"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "markAsync", [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, "markAsync"), _class.prototype)), _class));
exports.default = Async;