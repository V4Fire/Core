"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _assembler = _interopRequireDefault(require("../../../../core/json/stream/assembler"));
class Streamer {
  level = 1;
  isChecked = false;
  constructor(opts) {
    this.assembler = new _assembler.default(opts);
  }
  *processToken(chunk) {
    if (!this.isChecked && this.checkToken(chunk)) {
      this.isChecked = true;
    }
    if (!this.isChecked) {
      return;
    }
    if (Object.isFunction(this.assembler[chunk.name])) {
      this.assembler[chunk.name](chunk.value);
      if (this.assembler.depth === this.level) {
        yield* this.push();
      }
    }
  }
}
exports.default = Streamer;