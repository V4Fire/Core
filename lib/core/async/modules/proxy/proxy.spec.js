"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _async = _interopRequireDefault(require("../../../../core/async"));
var _symbol = _interopRequireDefault(require("../../../../core/symbol"));
const $$ = (0, _symbol.default)();
describe('core/async/modules/proxy `proxy`', () => {
  it('simple proxy', () => {
    let i = 0;
    const $a = new _async.default(),
      cb = v => i += v,
      proxy = $a.proxy(cb);
    proxy(1);
    proxy(2);
    expect(i).toBe(1);
  });
  it('proxy with support of multiple calls', () => {
    let i = 0;
    const $a = new _async.default(),
      cb = v => i += v,
      proxy = $a.proxy(cb, {
        single: false
      });
    proxy(1);
    proxy(2);
    expect(i).toBe(3);
  });
  it('clearing of a proxy', () => {
    let i = 0;
    const $a = new _async.default(),
      cb = v => i += v,
      proxy = $a.proxy(cb);
    $a.clearProxy(proxy);
    proxy(1);
    expect(i).toBe(0);
  });
  it('muting of a proxy', () => {
    let i = 0;
    const $a = new _async.default(),
      cb = v => i += v,
      proxy = $a.proxy(cb);
    $a.muteProxy(proxy);
    proxy(1);
    $a.unmuteProxy(proxy);
    proxy(2);
    expect(i).toBe(2);
  });
  it('suspending of a proxy', () => {
    let i = 0;
    const $a = new _async.default(),
      cb = v => i += v,
      proxy = $a.proxy(cb);
    $a.suspendProxy();
    proxy(1);
    $a.unsuspendProxy();
    proxy(2);
    expect(i).toBe(1);
  });
  it('proxies with labels', () => {
    const onResolve = (res, label) => (v = label) => {
      res.push(v);
      return v;
    };
    const onReject = spy => err => spy(Object.select(err, ['type', 'reason'])),
      onMerge = (spy, label) => () => spy(label);
    {
      const $a = new _async.default(),
        spy = jest.fn(),
        res = [];
      const f = $a.proxy(onResolve(res, 'first'), {
          label: $$.foo,
          onClear: onReject(spy)
        }),
        s = $a.proxy(onResolve(res, 'second'), {
          label: $$.foo,
          onClear: onReject(spy)
        });
      f();
      s();
      expect(res).toEqual(['second']);
      expect(spy).toHaveBeenCalledWith({
        type: 'clearAsync',
        reason: 'collision'
      });
    }
    {
      const $a = new _async.default(),
        spy = jest.fn(),
        res = [];
      const f = $a.proxy(onResolve(res, 'first'), {
          label: $$.foo,
          join: true,
          onMerge: onMerge(spy, 'first')
        }),
        s = $a.proxy(onResolve(res, 'second'), {
          label: $$.foo,
          join: true,
          onMerge: onMerge(spy, 'second')
        });
      f();
      s();
      expect(res).toEqual(['first']);
      expect(spy).toHaveBeenCalledWith('second');
    }
    {
      const $a = new _async.default(),
        spy = jest.fn(),
        res = [];
      const f = $a.proxy(onResolve(res, 'first'), {
          label: $$.foo,
          join: 'replace',
          onClear: onReject(spy)
        }),
        s = $a.proxy(onResolve(res, 'second'), {
          label: $$.foo,
          join: 'replace',
          onClear: onReject(spy)
        });
      f();
      s();
      expect(res).toEqual(['second']);
      expect(spy).toHaveBeenCalledWith({
        type: 'clearAsync',
        reason: 'collision'
      });
    }
  });
});