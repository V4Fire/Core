"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.provider = provider;
var _const = require("../../core/data/const");
function provider(nmsOrFn) {
  if (Object.isString(nmsOrFn)) {
    return target => {
      const nms = `${nmsOrFn}.${target.name}`;
      target[_const.namespace] = nms;
      _const.providers[nms] = target;
    };
  }
  nmsOrFn[_const.namespace] = nmsOrFn.name;
  _const.providers[nmsOrFn.name] = nmsOrFn;
}