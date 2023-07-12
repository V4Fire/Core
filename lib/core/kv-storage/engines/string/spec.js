"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var kv = _interopRequireWildcard(require("../../../../core/kv-storage"));
var _string = _interopRequireDefault(require("../../../../core/kv-storage/engines/string"));
var _const = require("../../../../core/kv-storage/engines/string/const");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
describe('kv-storage/engines/string', () => {
  let storage, engine;
  beforeEach(() => {
    engine = new _string.default();
    storage = kv.factory(engine);
  });
  it('the storage can be initialized with data', () => {
    const initialData = `foo${_const.defaultDataSeparators.record}true${_const.defaultDataSeparators.chunk}bar${_const.defaultDataSeparators.record}baz`;
    const engine = new _string.default({
        data: initialData
      }),
      storage = kv.factory(engine);
    expect(engine.serializedData).toBe(initialData);
    expect(storage.get('foo')).toBe(true);
    expect(storage.get('bar')).toBe('baz');
  });
  it('removing a value should delete it from the string', () => {
    storage.set('foo', true);
    storage.set('bar', 1);
    expect(engine.serializedData).toBe(`foo${_const.defaultDataSeparators.record}true${_const.defaultDataSeparators.chunk}bar${_const.defaultDataSeparators.record}1`);
    storage.remove('bar');
    expect(engine.serializedData).toBe(`foo${_const.defaultDataSeparators.record}true`);
    expect(storage.get('bar')).toBe(undefined);
  });
  it('getting all keys stored in the storage', () => {
    engine.set('a', '1');
    engine.set('b', '2');
    engine.set('c', '3');
    expect(engine.keys()).toEqual(['a', 'b', 'c']);
  });
  it('adding a new value should save it to the string', () => {
    storage.set('foo', 'some value');
    expect(engine.serializedData).toBe(`foo${_const.defaultDataSeparators.record}"some value"`);
    expect(storage.get('foo')).toBe('some value');
    storage.set('bar', [1, 2, 3]);
    expect(engine.serializedData).toBe(`foo${_const.defaultDataSeparators.record}"some value"${_const.defaultDataSeparators.chunk}bar${_const.defaultDataSeparators.record}[1,2,3]`);
    expect(storage.get('bar')).toEqual([1, 2, 3]);
  });
  it('clearing the storage should clear the string', () => {
    storage.set('foo', true);
    storage.set('bar', 1);
    storage.clear();
    expect(engine.serializedData).toBe('');
  });
  it('clearing the storage with passing a function should only clear those values for which the filter returned true', () => {
    storage.set('foo', true);
    storage.set('bar', 1);
    storage.set('baz', 2);
    storage.clear(el => Object.isNumber(el));
    expect(engine.serializedData).toBe(`foo${_const.defaultDataSeparators.record}true`);
    storage.clear((el, key) => key === 'foo');
    expect(engine.serializedData).toBe('');
  });
  it('using non-standard separators', () => {
    const engine = new _string.default({
        separators: {
          record: '=',
          chunk: ';'
        }
      }),
      storage = kv.factory(engine);
    storage.set('foo', 1);
    storage.set('bar', true);
    expect(engine.serializedData).toBe('foo=1;bar=true');
  });
});