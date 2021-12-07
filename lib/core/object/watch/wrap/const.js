"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.weakSetMethods = exports.weakMapMethods = exports.structureWrappers = exports.iterators = exports.deleteMethods = exports.clearMethods = void 0;

var proxyEngine = _interopRequireWildcard(require("../../../../core/object/watch/engines/proxy"));

var _helpers = require("../../../../core/object/watch/engines/helpers");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const iterators = {
  keys: {
    type: 'get',

    *value(target, opts) {
      const iterable = opts.original.call(target);

      for (let el = iterable.next(); !el.done; el = iterable.next()) {
        yield el.value;
      }
    }

  },
  entries: {
    type: 'get',

    *value(target, opts) {
      const iterable = opts.original.call(target);

      for (let el = iterable.next(); !el.done; el = iterable.next()) {
        const [key, val] = el.value;
        yield [key, (0, _helpers.getProxyValue)(val, key, opts.path, opts.handlers, opts.root, opts.top ?? opts.root, opts.watchOpts)];
      }
    }

  },
  values: {
    type: 'get',

    *value(target) {
      const iterable = target.entries();

      for (let el = iterable.next(); !el.done; el = iterable.next()) {
        const [, val] = el.value;
        yield val;
      }
    }

  },
  [Symbol.iterator]: {
    type: 'get',
    value: target => target.values()
  }
};
exports.iterators = iterators;
const deleteMethods = {
  delete: (target, opts, key) => {
    if (target.has(key)) {
      return [[undefined, 'get' in target ? target.get(key) : key, [...opts.path, key]]];
    }

    return null;
  }
};
exports.deleteMethods = deleteMethods;
const clearMethods = {
  clear: (target, opts) => {
    if (target.size !== 0) {
      return [[undefined, undefined, opts.path]];
    }

    return null;
  }
};
exports.clearMethods = clearMethods;
const weakMapMethods = { ...deleteMethods,
  get: {
    type: 'get',
    value: (target, opts, key) => {
      const val = opts.original.call(target, key);
      return (0, _helpers.getProxyValue)(val, key, opts.path, opts.handlers, opts.root, opts.top ?? opts.root, opts.watchOpts);
    }
  },
  set: (target, opts, key, value) => {
    const oldVal = target.get(key);
    return oldVal !== value ? [[value, oldVal, [...opts.path, key]]] : null;
  }
};
exports.weakMapMethods = weakMapMethods;
const weakSetMethods = { ...deleteMethods,
  add: (target, opts, value) => {
    if (!target.has(value)) {
      return [[value, undefined, [...opts.path, value]]];
    }

    return null;
  }
};
exports.weakSetMethods = weakSetMethods;
const structureWrappers = Object.createDict({
  weakMap: {
    is: Object.isWeakMap.bind(Object),
    methods: weakMapMethods
  },
  weakSet: {
    is: Object.isWeakSet.bind(Object),
    methods: weakSetMethods
  },
  map: {
    is: Object.isMap.bind(Object),
    methods: { ...iterators,
      ...weakMapMethods,
      ...clearMethods
    }
  },
  set: {
    is: Object.isSet.bind(Object),
    methods: { ...iterators,
      ...weakSetMethods,
      ...clearMethods
    }
  },
  arrayProxyEngine: {
    is: (val, opts) => Object.isArray(val) && opts.watchOpts.engine === proxyEngine,
    methods: { ...iterators
    }
  },
  array: {
    is: (val, opts) => Object.isArray(val) && opts.watchOpts.engine !== proxyEngine,
    methods: { ...iterators,
      push: (target, opts, ...value) => {
        const res = [];

        for (let i = 0; i < value.length; i++) {
          res.push([value[i], undefined, [...opts.path, target.length + i]]);
        }

        return res;
      },
      pop: (target, opts) => {
        const l = target.length;
        return l > 0 ? [[l - 1, l, [...opts.path, 'length']]] : null;
      },
      unshift: (target, opts, ...value) => {
        const res = [];

        for (let i = target.length - 1; i >= 0; i--) {
          res.push([target[i], target[i + value.length], [...opts.path, i + value.length]]);
        }

        for (let i = 0; i < value.length; i++) {
          res.push([value[i], target[i], [...opts.path, i]]);
        }

        return res;
      },
      shift: (target, opts) => {
        if (target.length > 0) {
          const l = target.length,
                res = [];

          for (let i = 1; i < l; i++) {
            res.push([target[i], target[i - 1], [...opts.path, i - 1]]);
          }

          res.push([l - 1, l, [...opts.path, 'length']]);
          return res;
        }

        return null;
      },
      splice: (target, opts, start, deleteNumber, ...newEls) => {
        const targetLength = target.length;

        if (start == null || start >= targetLength) {
          return null;
        }

        deleteNumber ??= target.length;

        if (deleteNumber <= 0 && newEls.length === 0) {
          return null;
        }

        const newLength = targetLength + newEls.length - deleteNumber;
        const res = [];
        const rightBorder = start + deleteNumber >= targetLength ? target.length - 1 : start + deleteNumber;

        if (newLength > targetLength) {
          const diff = newLength - targetLength;

          for (let i = targetLength - 1; i >= rightBorder; i--) {
            res.push([target[i], undefined, [...opts.path, i + diff]]);
          }
        } else {
          for (let i = rightBorder; i < targetLength; i++) {
            const newI = i - deleteNumber + 1;
            res.push([target[i], target[newI], [...opts.path, newI]]);
          }
        }

        for (let i = start, j = 0; j < newEls.length; i++, j++) {
          res.push([newEls[j], target[i], [...opts.path, i]]);
        }

        if (newLength < targetLength) {
          res.push([newLength, targetLength, [...opts.path, 'length']]);
        }

        return res;
      }
    }
  }
});
exports.structureWrappers = structureWrappers;