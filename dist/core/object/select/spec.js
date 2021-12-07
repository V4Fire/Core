"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _select = _interopRequireDefault(require("../../../core/object/select"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/object/select', () => {
  describe('searching upon a plain object', () => {
    it('`where` is provided', () => {
      const obj = {
        foo: 1,
        bla: 2
      };
      expect((0, _select.default)(obj, {
        where: obj
      })).toBe(obj);
      expect((0, _select.default)(obj, {
        where: {
          foo: 1
        }
      })).toBe(obj);
      expect((0, _select.default)(obj, {
        where: {
          foo: 1,
          bla: 2
        }
      })).toBe(obj);
      expect((0, _select.default)(obj, {
        where: {
          foo: 1,
          bla: 3
        }
      })).toBeUndefined();
      expect((0, _select.default)(obj, {
        where: {
          foo: 11
        }
      })).toBeUndefined();
      expect((0, _select.default)(obj, {
        where: {}
      })).toBeUndefined();
    });
    it("`where` isn't provided", () => {
      const obj = {
        foo: 1,
        bla: 2
      };
      expect((0, _select.default)(obj)).toBeUndefined();
      expect((0, _select.default)(obj, {
        from: 'foo'
      })).toBe(1);
    });
    it('`where` as an array', () => {
      const obj = {
        foo: 1,
        bla: 2
      };
      expect((0, _select.default)(obj, {
        where: [{
          foo: 11
        }, {
          bla: 2
        }]
      })).toBe(obj);
      expect((0, _select.default)(obj, {
        where: [{
          foo: 11
        }, {
          bla: 22
        }]
      })).toBeUndefined();
      expect((0, _select.default)(obj, {
        where: []
      })).toBeUndefined();
    });
    it('`where` contains non-defined keys', () => {
      const obj = {
        foo: 1,
        bla: 2
      };
      expect((0, _select.default)(obj, {
        where: {
          b2: 1
        }
      })).toBeUndefined();
      expect((0, _select.default)(obj, {
        where: {
          foo: 1,
          b2: 1
        }
      })).toBe(obj);
    });
    it('`where` contains complex conditions', () => {
      const obj = {
        foo: {
          b: [1, 2, 3]
        }
      };
      expect((0, _select.default)(obj, {
        where: {
          foo: {
            b: [1, 2, 3]
          }
        }
      })).toBe(obj);
      expect((0, _select.default)(obj, {
        where: {
          foo: {
            b: [1]
          }
        }
      })).toBeUndefined();
    });
    it('`from` is provided', () => {
      const obj = {
        a: {
          b: {
            c: new Map([[1, {
              foo: 1,
              baz: 2
            }]]),
            d: {
              foo: 1,
              bla: 2
            }
          }
        },
        1: 1
      };
      expect((0, _select.default)(obj, {
        from: 'a.b.d'
      })).toEqual({
        foo: 1,
        bla: 2
      });
      expect((0, _select.default)(obj, {
        from: ['a', 'b', 'c', 1]
      })).toEqual({
        foo: 1,
        baz: 2
      });
      expect((0, _select.default)(obj, {
        from: 1
      })).toBe(1);
    });
    it('`from` and `where` are provided', () => {
      const obj = {
        a: {
          b: {
            c: new Map([[1, {
              foo: 1,
              baz: 2
            }]]),
            d: {
              foo: 1,
              bla: 2
            }
          }
        },
        1: 1
      };
      expect((0, _select.default)(obj, {
        from: 'a.b.d',
        where: {
          foo: 1
        }
      })).toEqual({
        foo: 1,
        bla: 2
      });
      expect((0, _select.default)(obj, {
        from: ['a', 'b', 'c', 1],
        where: {
          foo: 11
        }
      })).toBeUndefined();
      expect((0, _select.default)(obj, {
        from: 1,
        where: {
          baz: 1
        }
      })).toBeUndefined();
      expect((0, _select.default)(obj, {
        from: 1,
        where: []
      })).toBeUndefined();
    });
  });
  describe('searching upon an iterable object', () => {
    it('`where` is provided', () => {
      const obj = [{
        foo: 1,
        bla: 2
      }, {
        baz: 3
      }];
      expect((0, _select.default)(obj, {
        where: obj
      })).toBe(obj[0]);
      expect((0, _select.default)(obj, {
        where: {
          foo: 1
        }
      })).toBe(obj[0]);
      expect((0, _select.default)(obj, {
        where: {
          foo: 1,
          bla: 2
        }
      })).toBe(obj[0]);
      expect((0, _select.default)(obj, {
        where: {
          foo: 1,
          bla: 3
        }
      })).toBeUndefined();
      expect((0, _select.default)(obj, {
        where: {
          foo: 11
        }
      })).toBeUndefined();
      expect((0, _select.default)(obj, {
        where: {}
      })).toBeUndefined();
    });
    it("`where` isn't provided", () => {
      const obj = new Set([{
        foo: 1,
        bla: 2
      }, {
        baz: 3
      }]);
      expect((0, _select.default)(obj)).toBeUndefined();
    });
    it('`where` as an array', () => {
      const obj = new Map([[1, {
        foo: 1,
        bla: 2
      }], [{}, {
        baz: 3
      }]]);
      expect((0, _select.default)(obj, {
        where: [{
          foo: 11
        }, {
          bla: 2
        }]
      })).toBe(obj.get(0));
      expect((0, _select.default)(obj, {
        where: [{
          foo: 11
        }, {
          bla: 22
        }]
      })).toBeUndefined();
      expect((0, _select.default)(obj, {
        where: []
      })).toBeUndefined();
    });
    it('`where` contains non-defined keys', () => {
      const obj = [{
        foo: 1,
        bla: 2
      }, {
        baz: 3
      }];
      expect((0, _select.default)(obj[Symbol.iterator](), {
        where: {
          b2: 1
        }
      })).toBeUndefined();
      expect((0, _select.default)(obj[Symbol.iterator](), {
        where: {
          foo: 1,
          b2: 1
        }
      })).toEqual({
        foo: 1,
        bla: 2
      });
    });
    it('`from` is provided', () => {
      const obj = [{
        a: {
          b: {
            c: new Map([[1, {
              foo: 1,
              baz: 2
            }]]),
            d: {
              foo: 1,
              bla: 2
            }
          }
        },
        1: 1
      }];
      expect((0, _select.default)(obj, {
        from: '0.a.b.d'
      })).toEqual({
        foo: 1,
        bla: 2
      });
      expect((0, _select.default)(obj, {
        from: [0, 'a', 'b', 'c', 1]
      })).toEqual({
        foo: 1,
        baz: 2
      });
      expect((0, _select.default)(obj, {
        from: [0, 1]
      })).toBe(1);
    });
    it('`from` and `where` are provided', () => {
      const obj = [{
        a: {
          b: {
            c: new Map([[1, {
              foo: 1,
              baz: 2
            }]]),
            d: {
              foo: 1,
              bla: 2
            }
          }
        },
        1: 1
      }];
      expect((0, _select.default)(obj, {
        from: '0.a.b.d',
        where: {
          foo: 1
        }
      })).toEqual({
        foo: 1,
        bla: 2
      });
      expect((0, _select.default)(obj, {
        from: [0, 'a', 'b', 'c', 1],
        where: {
          foo: 11
        }
      })).toBeUndefined();
      expect((0, _select.default)(obj, {
        from: '0.1',
        where: {
          baz: 1
        }
      })).toBeUndefined();
      expect((0, _select.default)(obj, {
        from: [0, 1],
        where: []
      })).toBeUndefined();
    });
  });
});