"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _addEmitter = _interopRequireWildcard(require("../../../../../core/cache/decorators/helpers/add-emitter"));
var _simple = _interopRequireDefault(require("../../../../../core/cache/simple"));
var _restricted = _interopRequireDefault(require("../../../../../core/cache/restricted"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
describe('core/cache/decorators/helpers/add-emitter', () => {
  describe('subscribe', () => {
    it('emits events only to top', () => {
      function CreateLevel(level) {
        this.level = level;
        this.remove = () => null;
        this.set = () => null;
        this.clear = () => null;
      }
      const level1 = new CreateLevel(1),
        level2 = new CreateLevel(2),
        level3 = new CreateLevel(3);
      const memory = [];
      Object.setPrototypeOf(level2, level1);
      Object.setPrototypeOf(level3, level2);
      const {
        subscribe: subscribe1
      } = (0, _addEmitter.default)(level1);
      const {
        subscribe: subscribe2
      } = (0, _addEmitter.default)(level2);
      const {
        subscribe: subscribe3
      } = (0, _addEmitter.default)(level3);
      subscribe1('remove', level1, () => memory.push('level1'));
      subscribe2('remove', level2, () => memory.push('level2'));
      subscribe3('remove', level3, () => memory.push('level3'));
      level1.remove();
      expect(memory).toEqual(['level1', 'level2', 'level3']);
      memory.length = 0;
      level2.remove();
      expect(memory).toEqual(['level2', 'level3']);
    });
  });
  describe('remove', () => {
    it("emits a remove event if `remove` was called and didn't emit if the original method was called", () => {
      const cache = new _simple.default(),
        {
          remove
        } = (0, _addEmitter.default)(cache);
      const memory = [];
      cache[_addEmitter.eventEmitter].on('remove', (...args) => {
        memory.push(args);
      });
      cache.set('foo', 1);
      cache.remove('foo');
      expect(memory[0]).toEqual([cache, {
        args: ['foo'],
        result: 1
      }]);
      cache.set('bar', 1);
      remove('bar');
      expect(memory[1]).toBe(undefined);
    });
    it('example with restricted cache', () => {
      const cache = new _restricted.default(1);
      (0, _addEmitter.default)(cache);
      const memory = [];
      cache[_addEmitter.eventEmitter].on('remove', (...args) => {
        memory.push(args);
      });
      cache.set('foo', 1);
      cache.set('bar', 1);
      expect(memory).toEqual([[cache, {
        args: ['foo'],
        result: 1
      }]]);
    });
  });
  describe('clear', () => {
    it('clears all', () => {
      const cache = new _simple.default(),
        {
          clear
        } = (0, _addEmitter.default)(cache);
      const memory = [];
      cache[_addEmitter.eventEmitter].on('clear', (...args) => {
        memory.push(args);
      });
      cache.set('foo', 1);
      cache.set('bar', 2);
      cache.clear();
      expect(memory[0]).toEqual([cache, {
        args: [],
        result: new Map([['foo', 1], ['bar', 2]])
      }]);
      cache.set('foo', 1);
      cache.set('bar', 2);
      clear();
      expect(memory[1]).toBe(undefined);
    });
    it('clears with a predicate', () => {
      const cache = new _simple.default();
      (0, _addEmitter.default)(cache);
      const memory = [],
        clearFunction = (el, key) => key === 'bar';
      cache[_addEmitter.eventEmitter].on('clear', (...args) => {
        memory.push(args);
      });
      cache.set('foo', 1);
      cache.set('bar', 2);
      cache.clear(clearFunction);
      expect(memory[0]).toEqual([cache, {
        args: [clearFunction],
        result: new Map([['bar', 2]])
      }]);
    });
  });
  describe('set', () => {
    it('sets a new value', () => {
      const cache = new _simple.default(),
        {
          set
        } = (0, _addEmitter.default)(cache);
      const memory = [];
      cache[_addEmitter.eventEmitter].on('set', (...args) => {
        memory.push(args);
      });
      cache.set('foo', 1, {
        ttl: 100,
        cacheTTL: 200
      });
      expect(memory[0]).toEqual([cache, {
        args: ['foo', 1, {
          ttl: 100,
          cacheTTL: 200
        }],
        result: 1
      }]);
      set('bar', 2);
      expect(memory[1]).toEqual(undefined);
    });
  });
});