"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _abstractFilter = _interopRequireDefault(require("../../../../core/json/stream/filters/abstract-filter"));
class Pick extends _abstractFilter.default {
  constructor(filter, opts) {
    super(filter, opts);
  }
  *checkToken(chunk) {
    switch (chunk.name) {
      case 'startObject':
      case 'startArray':
        if (this.filter(this.stack, chunk)) {
          yield chunk;
          this.processToken = this.passObject;
          this.depth = 1;
          return true;
        }
        break;
      case 'startString':
        if (this.filter(this.stack, chunk)) {
          yield chunk;
          this.processToken = this.passString;
          return true;
        }
        break;
      case 'startNumber':
        if (this.filter(this.stack, chunk)) {
          yield chunk;
          this.processToken = this.passNumber;
          return true;
        }
        break;
      case 'nullValue':
      case 'trueValue':
      case 'falseValue':
      case 'stringValue':
      case 'numberValue':
        if (this.filter(this.stack, chunk)) {
          yield chunk;
          this.processToken = this.multiple ? this.check : this.skip;
          return true;
        }
        break;
      default:
    }
    return false;
  }
}
exports.default = Pick;