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
  static namespaces = _const.namespaces;
  static linkNames = _const.namespaces;
  locked = false;
  cache = Object.createDict();
  workerCache = new WeakMap();
  idsMap = new WeakMap();
  usedNamespaces = new Set();
  get namespaces() {
    const constr = this.constructor;
    if (constr.namespaces !== constr.linkNames) {
      return constr.linkNames;
    }
    return constr.namespaces;
  }
  get linkNames() {
    (0, _functools.deprecate)({
      name: 'linkNames',
      type: 'accessor',
      renamedTo: 'namespaces'
    });
    return this.namespaces;
  }
  constructor(ctx) {
    this.ctx = ctx ?? Object.cast(this);
    this.context = this.ctx;
  }
  clearAll(opts) {
    this.usedNamespaces.forEach(key => {
      const alias = `clear-${this.namespaces[key]}`.camelize(false);
      if (Object.isFunction(this[alias])) {
        this[alias](opts);
      } else if (!_const2.isPromisifyNamespace.test(key)) {
        throw new ReferenceError(`The method "${alias}" is not defined`);
      }
    });
    return this;
  }
  muteAll(opts) {
    this.usedNamespaces.forEach(key => {
      const alias = `mute-${this.namespaces[key]}`.camelize(false);
      if (!_const2.isPromisifyNamespace.test(key) && Object.isFunction(this[alias])) {
        this[alias](opts);
      }
    });
    return this;
  }
  unmuteAll(opts) {
    this.usedNamespaces.forEach(key => {
      const alias = `unmute-${this.namespaces[key]}`.camelize(false);
      if (!_const2.isPromisifyNamespace.test(key) && Object.isFunction(this[alias])) {
        this[alias](opts);
      }
    });
    return this;
  }
  suspendAll(opts) {
    this.usedNamespaces.forEach(key => {
      const alias = `suspend-${this.namespaces[key]}`.camelize(false);
      if (!_const2.isPromisifyNamespace.test(key) && Object.isFunction(this[alias])) {
        this[alias](opts);
      }
    });
    return this;
  }
  unsuspendAll(opts) {
    this.usedNamespaces.forEach(key => {
      const alias = `unsuspend-${this.namespaces[key]}`.camelize(false);
      if (!_const2.isPromisifyNamespace.test(key) && Object.isFunction(this[alias])) {
        this[alias](opts);
      }
    });
    return this;
  }
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
  initCache(name, promise) {
    return this.getCache(name, promise);
  }
  registerTask(task) {
    if (this.locked) {
      return null;
    }
    this.usedNamespaces.add(task.promise ? 'promise' : task.name);
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
      const link = links.get(labelCache);
      Array.concat([], task.onMerge).forEach(handler => {
        handler.call(ctx, link);
      });
      return labelCache;
    }
    const normalizedObj = callable && Object.isFunction(task.obj) ? task.obj.call(ctx) : task.obj;
    let wrappedObj = normalizedObj,
      taskId = normalizedObj;
    if (!task.periodic || Object.isFunction(wrappedObj)) {
      wrappedObj = (...args) => {
        const link = links.get(taskId);
        if (link?.muted === true) {
          Array.concat([], task.onMutedCall).forEach(handler => {
            handler.call(ctx, link);
          });
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
            fns.forEach(fn => {
              if (Object.isFunction(fn)) {
                fn.apply(ctx, args);
              } else {
                fn[i].apply(ctx, args);
              }
            });
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
      this.cancelTask({
        ...task,
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
  setAsync(task) {
    return this.registerTask(task);
  }
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
      p = Object.isPlainObject(task) ? {
        ...task,
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
        Object.keys(baseCache.groups).forEach(group => {
          if (p.group.test(group)) {
            this.cancelTask({
              ...p,
              group,
              reason: 'rgxp'
            });
          }
        });
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
        const ctx = {
          ...p,
          link,
          type: 'clearAsync'
        };
        link.onClear.forEach(handler => {
          handler.call(this.ctx, ctx);
        });
        const {
          clearFn
        } = link;
        if (clearFn != null && !p.preventDefault) {
          clearFn(link.id, ctx);
        }
      }
    } else {
      links.forEach(link => {
        this.cancelTask({
          ...p,
          id: link.id
        });
      });
    }
    return this;
  }
  clearAsync(opts, name) {
    return this.cancelTask(opts, name);
  }
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
      p = Object.isPlainObject(task) ? {
        ...task,
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
        Object.keys(baseCache.groups).forEach(group => {
          if (p.group.test(group)) {
            this.markTask(label, {
              ...p,
              group,
              reason: 'rgxp'
            });
          }
        });
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
          link.queue.forEach(fn => fn());
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
      links.forEach(link => {
        this.markTask(label, {
          ...p,
          id: link.id
        });
      });
    }
    return this;
  }
  markAsync(label, opts, name) {
    return this.markTask(label, opts, name);
  }
  markAllTasks(label, opts) {
    this.markTask(label, opts);
    return this;
  }
}, ((0, _applyDecoratedDescriptor2.default)(_class.prototype, "initCache", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "initCache"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "setAsync", [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, "setAsync"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "clearAsync", [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, "clearAsync"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "markAsync", [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, "markAsync"), _class.prototype)), _class));
exports.default = Async;