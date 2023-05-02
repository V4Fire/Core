"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _abstractFilter = _interopRequireDefault(require("../../../../core/json/stream/filters/abstract-filter"));
class Filter extends _abstractFilter.default {
  multiple = true;
  objStack = [];
  constructor(filter) {
    super(filter);
  }
  *finishTokenProcessing() {
    const {
      stack,
      objStack
    } = this;
    const stackLength = stack.length,
      objStackLength = objStack.length;
    let commonLength = 0;
    for (const n = Math.min(stackLength, objStackLength); commonLength < n && stack[commonLength] === objStack[commonLength]; commonLength++) {}
    for (let i = objStackLength - 1; i > commonLength; i--) {
      yield {
        name: Object.isNumber(objStack[i]) ? 'endArray' : 'endObject'
      };
    }
    if (commonLength < objStackLength) {
      if (commonLength < stackLength) {
        if (Object.isString(stack[commonLength])) {
          const key = stack[commonLength];
          yield {
            name: 'startKey'
          };
          yield {
            name: 'stringChunk',
            value: key
          };
          yield {
            name: 'endKey'
          };
          yield {
            name: 'keyValue',
            value: key
          };
        }
        commonLength++;
      } else {
        yield {
          name: Object.isNumber(objStack[commonLength]) ? 'endArray' : 'endObject'
        };
      }
    }
    for (let i = commonLength; i < stackLength; i++) {
      const key = stack[i];
      if (Object.isNumber(key)) {
        if (key >= 0) {
          yield {
            name: 'startArray'
          };
        }
      } else if (Object.isString(key)) {
        yield {
          name: 'startObject'
        };
        yield {
          name: 'startKey'
        };
        yield {
          name: 'stringChunk',
          value: key
        };
        yield {
          name: 'endKey'
        };
        yield {
          name: 'keyValue',
          value: key
        };
      }
    }
    this.objStack = Array.prototype.concat.call(stack);
  }
  *checkToken(chunk) {
    switch (chunk.name) {
      case 'startObject':
        if (this.filter(this.stack, chunk)) {
          yield* this.finishTokenProcessing();
          yield chunk;
          this.objStack.push(null);
        }
        break;
      case 'startArray':
        if (this.filter(this.stack, chunk)) {
          yield* this.finishTokenProcessing();
          yield chunk;
          this.objStack.push(-1);
        }
        break;
      case 'nullValue':
      case 'trueValue':
      case 'falseValue':
      case 'stringValue':
      case 'numberValue':
        if (this.filter(this.stack, chunk)) {
          yield* this.finishTokenProcessing();
          yield chunk;
        }
        break;
      case 'startString':
        if (this.filter(this.stack, chunk)) {
          yield* this.finishTokenProcessing();
          yield chunk;
          this.processToken = this.passString;
        } else {
          this.processToken = this.skipString;
        }
        break;
      case 'startNumber':
        if (this.filter(this.stack, chunk)) {
          yield* this.finishTokenProcessing();
          yield chunk;
          this.processToken = this.passNumber;
        } else {
          this.processToken = this.skipNumber;
        }
        break;
      default:
    }
    return false;
  }
}
exports.default = Filter;