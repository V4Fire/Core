"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _kvStorage = require("../../../core/kv-storage");

var _persistent = _interopRequireDefault(require("../../../core/cache/decorators/persistent"));

var _ttl = _interopRequireDefault(require("../../../core/cache/decorators/ttl"));

var _restricted = _interopRequireDefault(require("../../../core/cache/restricted"));

var _const = require("../../../core/cache/decorators/persistent/engines/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/cache/decorators', () => {
  it('complex test', async () => {
    spyOn(Date, 'now').and.returnValue(0);
    const opts = {
      loadFromStorage: 'onInit'
    };
    const cache = new _restricted.default(2),
          cacheWithTTL = (0, _ttl.default)(cache),
          persistentCache = await (0, _persistent.default)(cacheWithTTL, _kvStorage.asyncLocal, opts);
    await persistentCache.set('foo', 1);
    await persistentCache.set('bar', 1, {
      ttl: 10
    });
    expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({
      foo: Number.MAX_SAFE_INTEGER,
      bar: Number.MAX_SAFE_INTEGER
    });
    await persistentCache.set('baz', 1);
    expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({
      bar: Number.MAX_SAFE_INTEGER,
      baz: Number.MAX_SAFE_INTEGER
    });
    await new Promise(r => setTimeout(r, 50));
    expect(await _kvStorage.asyncLocal.get(_const.INDEX_STORAGE_NAME)).toEqual({
      baz: Number.MAX_SAFE_INTEGER
    });
  });
});