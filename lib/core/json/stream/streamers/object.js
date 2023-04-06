"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _interface = _interopRequireDefault(require("../../../../core/json/stream/streamers/interface"));
class StreamObject extends _interface.default {
  key = null;
  constructor(opts) {
    super(opts);
  }
  checkToken(chunk) {
    if (chunk.name !== 'startObject') {
      throw new TypeError('The top-level object should be an object');
    }
    return true;
  }
  *push() {
    const {
      key,
      value
    } = this.assembler;
    if (this.key == null) {
      this.key = key;
    } else if (Object.isDictionary(value)) {
      yield {
        key: this.key,
        value: Object.cast(value[this.key])
      };
      this.key = null;
      this.assembler.value = {};
    }
  }
}
exports.default = StreamObject;