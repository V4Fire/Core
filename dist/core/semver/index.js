"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = compare;

var _const = require("../../core/semver/const");

Object.keys(_const).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _const[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _const[key];
    }
  });
});

var _interface = require("../../core/semver/interface");

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
 * [[include:core/semver/README.md]]
 * @packageDocumentation
 */

/**
 * Compares two strings with number versions (a <op> b) by using the semver strategy
 *
 * @param a
 * @param b
 * @param op - operation type
 * @param [opts] - additional options for the specified operation
 */
function compare(a, b, op, opts = {
  x: '*'
}) {
  if (a.trim() === '' || b.trim() === '') {
    throw new Error(_const.operandLengthErrorText);
  }

  if (!(op in _const.operations)) {
    throw new TypeError(`Unknown comparator "${op}". Only "${Object.keys(_const.operations).join(', ')}" available.`);
  }

  const left = a.split('.'),
        right = b.split('.'),
        {
    x
  } = opts;

  const strategyMatch = _const.compareRgxp.exec(op);

  let strategy = 'ord';

  if (strategyMatch?.[0] === op) {
    strategy = 'range';
  } else if (strategyMatch?.index === 0) {
    // Using for the equal ==
    strategy = 'eq';
  }

  const max = Math.max(left.length, right.length);
  let prevRes = false,
      res = false;

  for (let i = 0; i < max; i++) {
    const l = left[i] ?? x,
          r = right[i] ?? x;
    const rVal = parseInt(r, 10),
          lVal = parseInt(l, 10);

    if (i > 0) {
      prevRes = res;
    }

    res = _const.operations[op](lVal, rVal);

    switch (strategy) {
      case 'range':
        if (!res) {
          if (op.startsWith('~')) {
            return l === x || r === x || i > 0 && rVal < lVal;
          }

          return i > 0 && right[i - 1] !== '0' && rVal < lVal || l === x || r === x;
        }

        break;

      case 'eq':
        if (!res) {
          return l === x || r === x;
        }

        break;

      case 'ord':
        if (!res && (r === x || l === x)) {
          // 1.3.0 <= >= 1.2.*
          if (op.length === 2 && !prevRes) {
            return false;
          } // 1.2.4 >< 1.*
          // 1.2.4 >< 1.2.*
          // 1.* >< 1.2.4
          // 1.2.* >< 1.2.4


          return op.length !== 1;
        } // 1.2.1 <= 1.1.1
        // 2.1.1 <= 1.1.1
        // 1.1.1 >= 1.2.1
        // 1.1.1 >= 2.1.1


        if (!res && op.length === 2) {
          return res;
        } // 1.1.2 > 1.2.1
        // 1.2.2 > 2.1.1


        if (!res && op.length === 1 && rVal !== lVal) {
          return res;
        } // 1.1.2 <= 1.2.1
        // 1.2.2 <= 2.1.1


        if (res && op.length === 2 && rVal !== lVal) {
          return res;
        } // 1.1.2 > 1.1.1
        // 1.3.0 > 1.2.*


        if (res && op.length === 1) {
          return res;
        }

        break;

      default:
        throw new TypeError('Unsupported operation');
    }
  }

  return res;
}