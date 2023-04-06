"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  $$: true
};
exports.default = exports.$$ = void 0;
var _symbol = _interopRequireDefault(require("../../../../core/symbol"));
var _const = require("../../../../core/json/stream/assembler/const");
var _interface = require("../../../../core/json/stream/assembler/interface");
Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});
const $$ = (0, _symbol.default)();
exports.$$ = $$;
class Assembler {
  key = null;
  value = _const.NULL;
  get isValueAssembled() {
    return this[$$.isValueAssembled] ?? false;
  }
  set isValueAssembled(value) {
    this[$$.isValueAssembled] = value;
  }
  get depth() {
    return Math.floor(this.stack.length / 2) + (this.isValueAssembled ? 0 : 1);
  }
  stack = [];
  startObject = this.createStartObjectHandler(Object);
  startArray = this.createStartObjectHandler(Array);
  constructor(opts = {}) {
    if (Object.isFunction(opts.reviver)) {
      this.reviver = opts.reviver;
    }
    if (opts.numberAsString) {
      this.numberValue = this.stringValue;
    }
  }
  *processToken(chunk) {
    this[chunk.name]?.(chunk.value);
    if (this.isValueAssembled) {
      yield Object.cast(this.value);
      this.value = _const.NULL;
      this.isValueAssembled = false;
    }
  }
  createStartObjectHandler(Constr) {
    return () => {
      if (this.isValueAssembled) {
        this.isValueAssembled = false;
      }
      if (this.value !== _const.NULL) {
        this.stack.push(this.value, this.key);
      }
      this.value = Object.cast(new Constr());
      this.key = null;
    };
  }
  keyValue(value) {
    this.key = value;
  }
  stringValue(value) {
    this.endPrimitive();
    this.saveValue(value);
  }
  numberValue(value) {
    this.endPrimitive();
    this.saveValue(parseFloat(value));
  }
  nullValue() {
    this.endPrimitive();
    this.saveValue(null);
  }
  trueValue() {
    this.endPrimitive();
    this.saveValue(true);
  }
  falseValue() {
    this.endPrimitive();
    this.saveValue(false);
  }
  endObject() {
    if (this.stack.length > 0) {
      const {
        value
      } = this;
      this.key = Object.cast(this.stack.pop());
      this.value = this.stack.pop() ?? null;
      this.saveValue(value);
    } else {
      this.isValueAssembled = true;
    }
  }
  endArray() {
    this.endObject();
  }
  endPrimitive() {
    if (this.value === _const.NULL) {
      this.isValueAssembled = true;
    }
  }
  saveValue(value) {
    if (this.isValueAssembled) {
      this.value = this.reviver?.('', value) ?? value;
    } else if (Object.isArray(this.value)) {
      const val = this.reviver?.(String(this.value.length), value) ?? value;
      if (val !== undefined) {
        this.value.push(val);
      }
    } else if (Object.isDictionary(this.value) && Object.isString(this.key)) {
      const val = this.reviver?.(this.key, value) ?? value;
      if (val !== undefined) {
        this.value[this.key] = val;
      }
      this.key = null;
    }
  }
}
exports.default = Assembler;