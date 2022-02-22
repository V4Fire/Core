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

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/json/stream/assembler/README.md]]
 * @packageDocumentation
 */
const $$ = (0, _symbol.default)();
exports.$$ = $$;

class Assembler {
  /**
   * Property key of the active assembling value
   */
  key = null;
  /**
   * A value of the active assembled item.
   * If it is a container (object or array), all new assembled values will be added to it.
   */

  value = _const.NULL;
  /**
   * Indicates that the active value is fully assembled
   */

  get isValueAssembled() {
    return this[$$.isValueAssembled] ?? false;
  }
  /**
   * Sets the value assembling status
   * @param value
   */


  set isValueAssembled(value) {
    this[$$.isValueAssembled] = value;
  }
  /**
   * Depth of the assembling structure
   */


  get depth() {
    // To ignore keys from the stack divide length by two
    return Math.floor(this.stack.length / 2) + (this.isValueAssembled ? 0 : 1);
  }
  /**
   * Stack of nested assembled items and keys contained within the active assembling value
   */


  stack = [];
  /**
   * Handler to process an object start
   */

  startObject = this.createStartObjectHandler(Object);
  /**
   * Handler to process an array start
   */

  startArray = this.createStartObjectHandler(Array);
  /**
   * Function to transform a value after assembling.
   * Its API is identical to the reviver from `JSON.parse`.
   *
   * @param key
   * @param value
   */

  /**
   * @param [opts] - additional options
   */
  constructor(opts = {}) {
    if (Object.isFunction(opts.reviver)) {
      this.reviver = opts.reviver;
    }

    if (opts.numberAsString) {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.numberValue = this.stringValue;
    }
  }
  /**
   * Processes the passed JSON token and yields the assembled values
   */


  *processToken(chunk) {
    this[chunk.name]?.(chunk.value);

    if (this.isValueAssembled) {
      yield Object.cast(this.value);
      this.value = _const.NULL;
      this.isValueAssembled = false;
    }
  }
  /**
   * Creates a handler to process starting of an object or array
   * @param Constr - constructor to create a structure
   */


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
  /**
   * Handler to process an object key value
   * @param value
   */


  keyValue(value) {
    this.key = value;
  }
  /**
   * Handler to process a string value
   * @param value
   */


  stringValue(value) {
    this.endPrimitive();
    this.saveValue(value);
  }
  /**
   * Handler to process a number value
   * @param value
   */


  numberValue(value) {
    this.endPrimitive();
    this.saveValue(parseFloat(value));
  }
  /**
   * Handler to process nullish values
   */


  nullValue() {
    this.endPrimitive();
    this.saveValue(null);
  }
  /**
   * Handler to process a truly boolean value
   */


  trueValue() {
    this.endPrimitive();
    this.saveValue(true);
  }
  /**
   * Handler to process a falsy boolean value
   */


  falseValue() {
    this.endPrimitive();
    this.saveValue(false);
  }
  /**
   * Handler to process an object end
   */


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
  /**
   * Handler to process an array end
   */


  endArray() {
    this.endObject();
  }
  /**
   * Handler to process ending of primitive values
   */


  endPrimitive() {
    if (this.value === _const.NULL) {
      this.isValueAssembled = true;
    }
  }
  /**
   * Saves an assembled value into the internal structure
   * @param value
   */


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