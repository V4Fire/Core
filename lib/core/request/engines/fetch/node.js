"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const node = async (input, init) => {
  const response = await (0, _nodeFetch.default)(input, init),
        {
    body
  } = response;
  Object.defineProperty(response, 'body', {
    get() {
      body.getReader = () => {
        const iter = body[Symbol.asyncIterator]();
        return Object.cast({
          read: () => iter.next()
        });
      };

      return body;
    }

  });
  return response;
};

var _default = node;
exports.default = _default;