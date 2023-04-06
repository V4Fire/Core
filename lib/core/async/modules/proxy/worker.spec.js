"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _async = _interopRequireDefault(require("../../../../core/async"));
var _symbol = _interopRequireDefault(require("../../../../core/symbol"));
const $$ = (0, _symbol.default)();
describe('core/async/modules/proxy `worker`', () => {
  it('simple worker', () => {
    let i = 0;
    const $a = new _async.default();
    const worker = {
      terminate() {
        i++;
      }
    };
    expect($a.worker(worker)).toBe(worker);
    expect($a.worker(worker)).toBe(worker);
    $a.terminateWorker(worker);
    expect(i).toBe(1);
    $a.terminateWorker(worker);
    expect(i).toBe(1);
  });
  it('function worker', () => {
    let i = 0;
    const $a = new _async.default();
    const worker = () => i++;
    expect($a.worker(worker)).toBe(worker);
    expect($a.worker(worker)).toBe(worker);
    $a.terminateWorker(worker);
    expect(i).toBe(1);
    $a.terminateWorker(worker);
    expect(i).toBe(1);
  });
  it('shared worker', () => {
    let i = 0;
    const $a1 = new _async.default(),
      $a2 = new _async.default();
    const worker = {
      terminate() {
        i++;
      }
    };
    expect($a1.worker(worker)).toBe(worker);
    expect($a2.worker(worker)).toBe(worker);
    $a1.terminateWorker();
    expect(i).toBe(0);
    $a2.terminateWorker();
    expect(i).toBe(1);
  });
  it('workers with labels', () => {
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
      $a.worker(onResolve(res, 'first'), {
        label: $$.foo,
        onClear: onReject(spy)
      });
      $a.worker(onResolve(res, 'second'), {
        label: $$.foo,
        onClear: onReject(spy)
      });
      expect(res).toEqual(['first']);
      expect(spy).toHaveBeenCalledWith({
        type: 'clearAsync',
        reason: 'collision'
      });
    }
    {
      const $a = new _async.default(),
        spy = jest.fn(),
        res = [];
      $a.worker(onResolve(res, 'first'), {
        label: $$.foo,
        join: true,
        onMerge: onMerge(spy, 'first')
      });
      $a.worker(onResolve(res, 'second'), {
        label: $$.foo,
        join: true,
        onMerge: onMerge(spy, 'second')
      });
      expect(res).toEqual(['second']);
      expect(spy).toHaveBeenCalledWith('second');
    }
    {
      const $a = new _async.default(),
        spy = jest.fn(),
        res = [];
      $a.worker(onResolve(res, 'first'), {
        label: $$.foo,
        join: 'replace',
        onClear: onReject(spy)
      });
      $a.worker(onResolve(res, 'second'), {
        label: $$.foo,
        join: 'replace',
        onClear: onReject(spy)
      });
      expect(res).toEqual(['first']);
      expect(spy).toHaveBeenCalledWith({
        type: 'clearAsync',
        reason: 'collision'
      });
    }
  });
});