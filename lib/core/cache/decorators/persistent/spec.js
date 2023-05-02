"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var netModule = _interopRequireWildcard(require("../../../../core/net"));
var _kvStorage = require("../../../../core/kv-storage");
var _persistent = _interopRequireDefault(require("../../../../core/cache/decorators/persistent"));
var _simple = _interopRequireDefault(require("../../../../core/cache/simple"));
var _restricted = _interopRequireDefault(require("../../../../core/cache/restricted"));
var _const = require("../../../../core/cache/decorators/persistent/engines/const");
var _engines = _interopRequireDefault(require("../../../../core/cache/decorators/persistent/engines"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
describe('core/cache/decorators/persistent', () => {
  beforeEach(async () => {
    await _kvStorage.asyncLocal.clear();
  });
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => 0);
  });
  describe('core functionality', () => {
    it('providing the default `persistentTTL` option', async () => {
      const opts = {
        loadFromStorage: 'onInit',
        persistentTTL: 100
      };
      const cache = new _simple.default(),
        persistentCache = await (0, _persistent.default)(cache, _kvStorage.asyncLocal, opts);
      await persistentCache.set('foo', null);
      expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({
        foo: 100
      });
      await persistentCache.set('bar', null, {
        persistentTTL: 150
      });
      expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({
        foo: 100,
        bar: 150
      });
    });
    it('collapsing operations with the same key', async () => {
      const opts = {
        loadFromStorage: 'onInit'
      };
      const cache = new _simple.default(),
        persistentCache = await (0, _persistent.default)(cache, _kvStorage.asyncLocal, opts);
      jest.spyOn(_kvStorage.asyncLocal, 'set');
      persistentCache.set('foo', 1);
      await persistentCache.set('foo', 2);
      expect(_kvStorage.asyncLocal.set.mock.calls[0]).toEqual(['foo', 2]);
    });
    it('should delete a value from the storage if a side effect has deleted it', async () => {
      const opts = {
        loadFromStorage: 'onInit'
      };
      const cache = new _restricted.default(1),
        persistentCache = await (0, _persistent.default)(cache, _kvStorage.asyncLocal, opts);
      await persistentCache.set('foo', 1);
      expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({
        foo: Number.MAX_SAFE_INTEGER
      });
      await persistentCache.set('bar', 1);
      expect(await persistentCache.get('foo')).toBe(undefined);
      expect(await persistentCache.get('bar')).toBe(1);
      await new Promise(r => setTimeout(r, 10));
      expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({
        bar: Number.MAX_SAFE_INTEGER
      });
    });
    it('`clear` caused by a side effect', async () => {
      const opts = {
        loadFromStorage: 'onInit'
      };
      const cache = new _simple.default(),
        persistentCache = await (0, _persistent.default)(cache, _kvStorage.asyncLocal, opts);
      await persistentCache.set('foo', 1);
      await persistentCache.set('bar', 1);
      expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({
        foo: Number.MAX_SAFE_INTEGER,
        bar: Number.MAX_SAFE_INTEGER
      });
      cache.clear();
      await new Promise(r => setTimeout(r, 10));
      expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({});
    });
    it('`set` caused by a side effect', async () => {
      const opts = {
        loadFromStorage: 'onInit'
      };
      const cache = new _simple.default(),
        persistentCache = await (0, _persistent.default)(cache, _kvStorage.asyncLocal, opts);
      await persistentCache.set('foo', 1);
      cache.set('bar', 1);
      await new Promise(r => setTimeout(r, 10));
      expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({
        foo: Number.MAX_SAFE_INTEGER,
        bar: Number.MAX_SAFE_INTEGER
      });
    });
    it('setting the default `ttl` caused by a side effect', async () => {
      const opts = {
        loadFromStorage: 'onInit',
        persistentTTL: 100
      };
      const cache = new _simple.default(),
        persistentCache = await (0, _persistent.default)(cache, _kvStorage.asyncLocal, opts);
      await persistentCache.set('foo', 1, {
        persistentTTL: 500
      });
      cache.set('bar', 1);
      await new Promise(r => setTimeout(r, 10));
      expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({
        foo: 500,
        bar: 100
      });
    });
  });
  describe('`onInit` loading from the storage', () => {
    it('should init the cache during initialization', async () => {
      const opts = {
        loadFromStorage: 'onInit'
      };
      const persistentCache = await (0, _persistent.default)(new _simple.default(), _kvStorage.asyncLocal, opts);
      await persistentCache.set('foo', 'bar');
      await persistentCache.set('foo2', 'bar2');
      const newCache = new _simple.default();
      await (0, _persistent.default)(newCache, _kvStorage.asyncLocal, opts);
      expect(newCache.get('foo')).toEqual('bar');
      expect(newCache.get('foo2')).toEqual('bar2');
    });
    it('should save the `persistentTTL` descriptor', async () => {
      const opts = {
        loadFromStorage: 'onInit'
      };
      const persistentCache = await (0, _persistent.default)(new _simple.default(), _kvStorage.asyncLocal, opts);
      await persistentCache.set('foo', 'bar');
      await persistentCache.set('foo2', 'bar2', {
        persistentTTL: 100
      });
      expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({
        foo: Number.MAX_SAFE_INTEGER,
        foo2: 100
      });
    });
    it('should not save an item if it is already expired', async () => {
      const opts = {
        loadFromStorage: 'onInit'
      };
      const persistentCache = await (0, _persistent.default)(new _simple.default(), _kvStorage.asyncLocal, opts);
      await persistentCache.set('foo', 'bar', {
        persistentTTL: -100
      });
      const newCache = new _simple.default();
      expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({
        foo: -100
      });
      await (0, _persistent.default)(newCache, _kvStorage.asyncLocal, opts);
      expect(newCache.get('foo')).toEqual(undefined);
      expect(await _kvStorage.asyncLocal.get('foo')).toEqual(undefined);
      expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({});
    });
    it('removing the `persistentTTL` descriptor from a cache item', async () => {
      const opts = {
        loadFromStorage: 'onInit'
      };
      const persistentCache = await (0, _persistent.default)(new _simple.default(), _kvStorage.asyncLocal, opts);
      await persistentCache.set('foo', 'bar', {
        persistentTTL: 100
      });
      expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({
        foo: 100
      });
      await persistentCache.removePersistentTTLFrom('foo');
      expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({});
    });
  });
  describe('`onDemand` loading from the storage', () => {
    it('should work by default', async () => {
      const fn = jest.fn();
      const {
        onDemand
      } = _engines.default;
      _engines.default.onDemand = function onDemand() {
        fn();
      };
      await (0, _persistent.default)(new _simple.default(), _kvStorage.asyncLocal);
      _engines.default.onDemand = onDemand;
      expect(fn.mock.calls.length).toBe(1);
    });
    it('must save an item at the first demand', async () => {
      const opts = {
        loadFromStorage: 'onDemand'
      };
      const persistentCache = await (0, _persistent.default)(new _simple.default(), _kvStorage.asyncLocal, opts);
      await persistentCache.set('foo', 'bar');
      const newCache = new _simple.default(),
        copyOfCache = await (0, _persistent.default)(newCache, _kvStorage.asyncLocal, opts);
      expect(newCache.get('foo')).toEqual(undefined);
      expect(await copyOfCache.get('foo')).toEqual('bar');
      expect(newCache.get('foo')).toEqual('bar');
    });
    it('should save the `persistentTTL` descriptor', async () => {
      const opts = {
        loadFromStorage: 'onDemand'
      };
      const persistentCache = await (0, _persistent.default)(new _simple.default(), _kvStorage.asyncLocal, opts);
      await persistentCache.set('foo', 'bar');
      await persistentCache.set('foo2', 'bar2', {
        persistentTTL: 100
      });
      expect(await _kvStorage.asyncLocal.get(`foo${_const.TTL_POSTFIX}`)).toEqual(undefined);
      expect(await _kvStorage.asyncLocal.get(`foo2${_const.TTL_POSTFIX}`)).toEqual(100);
    });
    it('should not save an item if it is already expired', async () => {
      const opts = {
        loadFromStorage: 'onDemand'
      };
      const persistentCache = await (0, _persistent.default)(new _simple.default(), _kvStorage.asyncLocal, opts);
      await persistentCache.set('foo', 'bar', {
        persistentTTL: -100
      });
      const newCache = new _simple.default(),
        copyOfCache = await (0, _persistent.default)(newCache, _kvStorage.asyncLocal, opts);
      expect(await copyOfCache.get('foo')).toEqual(undefined);
      expect(newCache.get('foo')).toEqual(undefined);
      expect(await _kvStorage.asyncLocal.get('foo')).toEqual(undefined);
      expect(await _kvStorage.asyncLocal.get(`foo${_const.TTL_POSTFIX}`)).toEqual(undefined);
    });
    it('removing the `persistentTTL` descriptor from a cache item', async () => {
      const opts = {
        loadFromStorage: 'onDemand'
      };
      const persistentCache = await (0, _persistent.default)(new _simple.default(), _kvStorage.asyncLocal, opts);
      await persistentCache.set('foo', 'bar', {
        persistentTTL: 100
      });
      expect(await _kvStorage.asyncLocal.get(`foo${_const.TTL_POSTFIX}`)).toEqual(100);
      await persistentCache.removePersistentTTLFrom('foo');
      expect(await _kvStorage.asyncLocal.get(`foo${_const.TTL_POSTFIX}`)).toEqual(undefined);
    });
  });
  describe('`onOfflineDemand` loading from the storage', () => {
    it('must load a value from the storage cache only if there is no internet', async () => {
      const opts = {
        loadFromStorage: 'onOfflineDemand'
      };
      const persistentCache = await (0, _persistent.default)(new _simple.default(), _kvStorage.asyncLocal, opts);
      await persistentCache.set('foo', 'bar');
      await persistentCache.set('foo2', 'bar2');
      const newCache = new _simple.default(),
        copyOfCache = await (0, _persistent.default)(newCache, _kvStorage.asyncLocal, opts);
      jest.spyOn(netModule, 'isOnline').mockReturnValueOnce(Promise.resolve({
        status: false
      })).mockReturnValueOnce(Promise.resolve({
        status: true
      })).mockReturnValueOnce(Promise.resolve({
        status: false
      }));
      expect(newCache.get('foo')).toEqual(undefined);
      expect(await copyOfCache.get('foo')).toEqual('bar');
      expect(newCache.get('foo')).toEqual('bar');
      expect(newCache.get('foo2')).toEqual(undefined);
      expect(await copyOfCache.get('foo2')).toEqual(undefined);
      expect(newCache.get('foo2')).toEqual(undefined);
      expect(newCache.get('foo2')).toEqual(undefined);
      expect(await copyOfCache.get('foo2')).toEqual('bar2');
      expect(newCache.get('foo2')).toEqual('bar2');
    });
  });
});