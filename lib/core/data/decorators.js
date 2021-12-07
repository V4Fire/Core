"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.provider = provider;

var _const = require("../../core/data/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
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