"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapWithSuspending = wrapWithSuspending;
function wrapWithSuspending(opts, groupMod) {
  let group = Object.isPlainObject(opts) ? opts.group : null;
  if (groupMod != null) {
    group = `${group ?? ''}:${groupMod}`;
  }
  if (group == null || group.includes(':!suspend')) {
    return opts;
  }
  return {
    ...opts,
    group: `${group}:suspend`
  };
}