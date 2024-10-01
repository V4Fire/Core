"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class Task {
  get name() {
    return this.params.task.name;
  }
  unregistered = false;
  paused = false;
  muted = false;
  queue = [];
  onComplete = [];
  constructor(id, params, cache, globalCache) {
    this.id = id;
    this.params = params;
    this.task = params.task;
    this.group = params.group;
    this.label = params.label;
    this.onClear = Array.toArray(params.onClear);
    this.clear = params.clear ?? null;
    this.cache = cache;
    this.globalCache = globalCache;
  }
  unregister() {
    const {
      id,
      label,
      cache
    } = this;
    cache.links.delete(id);
    this.globalCache.root.links.delete(id);
    if (label != null && cache.labels?.[label] != null) {
      cache.labels[label] = undefined;
    }
    this.unregistered = true;
  }
}
exports.default = Task;