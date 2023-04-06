"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _interface = _interopRequireDefault(require("../../../../core/json/stream/streamers/interface"));
class ArrayStreamer extends _interface.default {
  index = 0;
  constructor(opts) {
    super(opts);
  }
  checkToken(chunk) {
    if (chunk.name !== 'startArray') {
      throw new TypeError('The top-level object should be an array');
    }
    return true;
  }
  *push() {
    const {
      value
    } = this.assembler;
    if (Object.isArray(value) && value.length > 0) {
      yield {
        index: this.index++,
        value: Object.cast(value.pop())
      };
    }
  }
}
exports.default = ArrayStreamer;