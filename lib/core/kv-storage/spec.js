"use strict";

var _kvStorage = require("../../core/kv-storage");

var IDBEngine = _interopRequireWildcard(require("../../core/kv-storage/engines/fake-indexeddb"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
// eslint-disable-next-line import/extensions
const kv = {
  local: _kvStorage.local,
  session: _kvStorage.session,
  asyncLocal: _kvStorage.asyncLocal,
  asyncSession: _kvStorage.asyncSession,
  IDBSession: (0, _kvStorage.factory)(IDBEngine.syncSessionStorage),
  asyncIDBLocal: (0, _kvStorage.factory)(IDBEngine.asyncLocalStorage, true),
  asyncIDBSession: (0, _kvStorage.factory)(IDBEngine.asyncSessionStorage, true)
};
describe('core/kv-storage', () => {
  const getNms = () => {
    const prfx = Math.random().toString(16);
    return name => `${prfx}_${name}`;
  };

  ['local', 'session', 'IDBSession'].forEach(method => {
    const api = kv[method];
    it(`synchronous "${method}" crud`, () => {
      const getKey = getNms();
      api.set(getKey('foo'), 1);
      expect(api.has(getKey('foo'))).toBe(true);
      expect(api.get(getKey('foo'))).toBe(1);
      api.set(getKey('foo'), true);
      expect(api.has(getKey('foo'))).toBe(true);
      expect(api.get(getKey('foo'))).toBe(true);
      api.set(getKey('foo'), [2, 3]);
      expect(api.has(getKey('foo'))).toBe(true);
      expect(api.get(getKey('foo'))).toEqual([2, 3]);
      api.remove(getKey('foo'));
      expect(api.has(getKey('foo'))).toBe(false);
    });
    it(`synchronous "${method}" clear with a filter`, () => {
      const getKey = getNms();
      api.set(getKey('foo'), 1);
      api.set(getKey('bar'), 2);
      expect(api.has(getKey('foo'))).toBe(true);
      expect(api.has(getKey('bar'))).toBe(true);
      api.clear((el, key) => key === getKey('bar'));
      expect(api.has(getKey('foo'))).toBe(true);
      expect(api.has(getKey('bar'))).toBe(false);
      api.remove(getKey('foo'));
    });
    {
      const getKey = getNms(),
            nms = api.namespace(getKey('custom namespace'));
      it(`namespaced synchronous "${method}" crud`, () => {
        nms.set('foo', 1);
        expect(nms.has('foo')).toBe(true);
        expect(nms.get('foo')).toBe(1);
        nms.set('foo', true);
        expect(nms.has('foo')).toBe(true);
        expect(nms.get('foo')).toBe(true);
        nms.set('foo', [2, 3]);
        expect(nms.has('foo')).toBe(true);
        expect(nms.get('foo')).toEqual([2, 3]);
        nms.remove('foo');
        expect(nms.has('foo')).toBe(false);
      });
      it(`namespaced synchronous "${method}" clear`, () => {
        nms.set('foo', 1);
        nms.set('bar', 2);
        expect(nms.has('foo')).toBe(true);
        expect(nms.has('bar')).toBe(true);
        nms.clear();
        expect(nms.has('foo')).toBe(false);
        expect(nms.has('bar')).toBe(false);
      });
      it(`namespaced synchronous "${method}" clear with a filter`, () => {
        nms.set('foo', 1);
        nms.set('bar', 'boom');
        expect(nms.has('foo')).toBe(true);
        expect(nms.has('bar')).toBe(true);
        nms.clear(el => el === 'boom');
        expect(nms.has('foo')).toBe(true);
        expect(nms.has('bar')).toBe(false);
        api.remove(getKey('foo'));
      });
    }
  });
  ['asyncLocal', 'asyncSession', 'asyncIDBLocal', 'asyncIDBSession'].forEach(method => {
    const api = kv[method];
    it(`asynchronous "${method}" crud`, async () => {
      const getKey = getNms();
      await api.set(getKey('foo'), 1);
      expect(await api.has(getKey('foo'))).toBe(true);
      expect(await api.get(getKey('foo'))).toBe(1);
      await api.set(getKey('foo'), true);
      expect(await api.has(getKey('foo'))).toBe(true);
      expect(await api.get(getKey('foo'))).toBe(true);
      await api.set(getKey('foo'), [2, 3]);
      expect(await api.has(getKey('foo'))).toBe(true);
      expect(await api.get(getKey('foo'))).toEqual([2, 3]);
      await api.remove(getKey('foo'));
      expect(await api.has(getKey('foo'))).toBe(false);
    });
    it(`asynchronous "${method}" clear with a filter`, async () => {
      const getKey = getNms();
      await api.set(getKey('foo'), 1);
      await api.set(getKey('bar'), 2);
      expect(await api.has(getKey('foo'))).toBe(true);
      expect(await api.has(getKey('bar'))).toBe(true);
      await api.clear((el, key) => key === getKey('bar'));
      expect(await api.has(getKey('foo'))).toBe(true);
      expect(await api.has(getKey('bar'))).toBe(false);
      api.remove(getKey('foo'));
    });
    {
      const getKey = getNms(),
            nms = api.namespace(getKey('custom namespace'));
      it(`namespaced asynchronous "${method}" crud`, async () => {
        await nms.set('foo', 1);
        expect(await nms.has('foo')).toBe(true);
        expect(await nms.get('foo')).toBe(1);
        await nms.set('foo', true);
        expect(await nms.has('foo')).toBe(true);
        expect(await nms.get('foo')).toBe(true);
        await nms.set('foo', [2, 3]);
        expect(await nms.has('foo')).toBe(true);
        expect(await nms.get('foo')).toEqual([2, 3]);
        await nms.remove('foo');
        expect(await nms.has('foo')).toBe(false);
      });
      it(`namespaced asynchronous "${method}" clear`, async () => {
        await nms.set('foo', 1);
        await nms.set('bar', 2);
        expect(await nms.has('foo')).toBe(true);
        expect(await nms.has('bar')).toBe(true);
        await nms.clear();
        expect(await nms.has('foo')).toBe(false);
        expect(await nms.has('bar')).toBe(false);
      });
      it(`namespaced asynchronous "${method}" clear with a filter`, async () => {
        await nms.set('foo', 1);
        await nms.set('bar', 'boom');
        expect(await nms.has('foo')).toBe(true);
        expect(await nms.has('bar')).toBe(true);
        await nms.clear(el => el === 'boom');
        expect(await nms.has('foo')).toBe(true);
        expect(await nms.has('bar')).toBe(false);
        api.remove(getKey('foo'));
      });
    }
  });
});
