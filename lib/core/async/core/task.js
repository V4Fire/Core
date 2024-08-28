"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class Task {
  get name() {
    return this.params.task.name;
  }
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
      cache: {
        links,
        labels
      }
    } = this;
    links.delete(id);
    this.globalCache.root.links.delete(id);
    if (label != null && labels?.[label] != null) {
      labels[label] = undefined;
    }
  }
}
exports.default = Task;