"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.$$ = void 0;
var _symbol = _interopRequireDefault(require("../../../../core/symbol"));
const $$ = (0, _symbol.default)();
exports.$$ = $$;
class AbstractFilter {
  static createPathFilter(path) {
    return stack => {
      const sep = '.',
        parsedPath = stack.join(sep);
      if (parsedPath.length === path.length && parsedPath === path) {
        return true;
      }
      if (parsedPath.length <= path.length || !parsedPath.startsWith(path)) {
        return false;
      }
      return parsedPath.substring(path.length, path.length + sep.length) === sep;
    };
  }
  static createRegExpFilter(rgxp) {
    return stack => rgxp.test(stack.join('.'));
  }
  multiple = false;
  get processToken() {
    return this[$$.processChunk];
  }
  set processToken(val) {
    this[$$.processChunk] = val;
  }
  stack = [];
  depth = 0;
  previousToken = '';
  passNumber = this.passValue('endNumber', 'numberValue');
  skipNumber = this.skipValue('endNumber', 'numberValue');
  passString = this.passValue('endString', 'stringValue');
  skipString = this.skipValue('endString', 'stringValue');
  passKey = this.passValue('endKey', 'keyValue');
  skipKey = this.skipValue('endKey', 'keyValue');
  constructor(filter, opts = {}) {
    this.processToken = this.check;
    if (Object.isString(filter)) {
      this.filter = AbstractFilter.createPathFilter(filter);
    } else if (Object.isRegExp(filter)) {
      this.filter = AbstractFilter.createRegExpFilter(filter);
    } else {
      this.filter = filter;
    }
    this.multiple = opts.multiple ?? this.multiple;
  }
  *finishTokenProcessing() {
    return undefined;
  }
  *check(token) {
    const last = this.stack.length - 1;
    switch (token.name) {
      case 'startObject':
      case 'startArray':
      case 'startString':
      case 'startNumber':
      case 'nullValue':
      case 'trueValue':
      case 'falseValue':
        if (Object.isNumber(this.stack[last])) {
          this.stack[last]++;
        }
        break;
      case 'keyValue':
        this.stack[last] = token.value;
        break;
      case 'numberValue':
        if (this.previousToken !== 'endNumber' && Object.isNumber(this.stack[last])) {
          this.stack[last]++;
        }
        break;
      case 'stringValue':
        if (this.previousToken !== 'endString' && Object.isNumber(this.stack[last])) {
          this.stack[last]++;
        }
        break;
      default:
    }
    this.previousToken = token.name;
    const iter = this.checkToken(token);
    while (true) {
      const {
        done,
        value
      } = iter.next();
      if (done && (value === true || value === undefined)) {
        break;
      }
      if (done && value === false) {
        switch (token.name) {
          case 'startObject':
            this.stack.push(null);
            break;
          case 'startArray':
            this.stack.push(-1);
            break;
          case 'endObject':
          case 'endArray':
            this.stack.pop();
            break;
          default:
        }
        break;
      } else {
        yield value;
      }
    }
  }
  *pass(token) {
    yield token;
  }
  *skip(_) {
    return undefined;
  }
  *passObject(token) {
    switch (token.name) {
      case 'startObject':
      case 'startArray':
        this.depth++;
        break;
      case 'endObject':
      case 'endArray':
        this.depth--;
        break;
      default:
    }
    if (this.depth === 0 && !this.multiple) {
      yield {
        ...token,
        filterComplete: true
      };
    } else {
      yield token;
    }
    if (this.depth === 0) {
      this.processToken = this.multiple ? this.check : this.skip;
    }
  }
  skipObject(chunk) {
    switch (chunk.name) {
      case 'startObject':
      case 'startArray':
        this.depth++;
        break;
      case 'endObject':
      case 'endArray':
        this.depth--;
        break;
      default:
    }
    if (this.depth === 0) {
      this.processToken = this.multiple ? this.check : this.pass;
    }
  }
  passValue(currentToken, expectedToken) {
    const that = this;
    return function* passValue(token) {
      if (that.expectedToken === undefined || that.expectedToken === '') {
        yield token;
        if (token.name === currentToken) {
          that.expectedToken = expectedToken;
        }
      } else {
        const {
          expectedToken
        } = that;
        that.expectedToken = '';
        that.processToken = that.multiple ? that.check : that.skip;
        if (expectedToken === token.name) {
          if (that.multiple) {
            yield token;
          } else {
            yield {
              ...token,
              filterComplete: true
            };
          }
        } else {
          yield* that.processToken(token);
        }
      }
    };
  }
  skipValue(currentToken, expectedToken) {
    const that = this;
    return function* skipValue(chunk) {
      if (that.expectedToken != null) {
        const {
          expectedToken
        } = that;
        that.expectedToken = '';
        that.processToken = that.multiple ? that.check : that.pass;
        if (expectedToken !== chunk.name) {
          yield* that.processToken(chunk);
        }
      } else if (chunk.name === currentToken) {
        that.expectedToken = expectedToken;
      }
    };
  }
}
exports.default = AbstractFilter;