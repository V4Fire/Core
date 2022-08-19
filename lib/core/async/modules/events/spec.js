"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _async = _interopRequireDefault(require("../../../../core/async"));

var _symbol = _interopRequireDefault(require("../../../../core/symbol"));

var _eventemitter = require("eventemitter2");

/* eslint-disable @typescript-eslint/strict-boolean-expressions */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const $$ = (0, _symbol.default)();
describe('core/async/modules/events', () => {
  it('simple event', () => {
    let i = 0;

    const $a = new _async.default(),
          $e = new _eventemitter.EventEmitter2(),
          cb = v => i += v;

    $a.on($e, 'foo', cb);
    $e.emit('foo', 1);
    $e.emit('foo', 2);
    expect(i).toBe(3);
  });
  it('multiple events', () => {
    let i = 0;

    const $a = new _async.default(),
          $e = new _eventemitter.EventEmitter2(),
          cb = v => i += v;

    $a.on($e, 'foo bar', cb);
    $a.on($e, ['foo', 'bar'], cb);
    $e.emit('foo', 1);
    $e.emit('bar', 1);
    expect(i).toBe(4);
  });
  it('emitter as a function', () => {
    let i = 0;
    const emitter = new _eventemitter.EventEmitter2();

    const $e = (event, handler) => {
      emitter.on(event, handler);
      return () => emitter.off(event, handler);
    };

    const $a = new _async.default(),
          cb = v => i += v;

    $a.on($e, 'foo bar', cb);
    $a.on($e, ['foo', 'bar'], cb);
    emitter.emit('foo', 1);
    emitter.emit('bar', 1);
    expect(i).toBe(4);
    $a.off();
    emitter.emit('foo', 1);
    emitter.emit('bar', 1);
    expect(i).toBe(4);
  });
  it('once event', () => {
    let i = 0;

    const $a = new _async.default(),
          $e = new _eventemitter.EventEmitter2(),
          cb = v => i += v;

    $a.once($e, 'foo', cb);
    $e.emit('foo', 1);
    $e.emit('foo', 2);
    expect(i).toBe(1);
  });
  it('once event with a label', () => {
    let i = 0;

    const $a = new _async.default(),
          $e = new _eventemitter.EventEmitter2(),
          cb = v => i += v;

    $a.once($e, 'foo', cb, {
      label: 'foo',
      join: true
    });
    $e.emit('foo', 1);
    $a.once($e, 'foo', cb, {
      label: 'foo',
      join: true
    });
    $e.emit('foo', 2);
    expect(i).toBe(3);
  });
  it('clearing of a listener', () => {
    let i = 0;

    const $a = new _async.default(),
          $e = new _eventemitter.EventEmitter2(),
          cb = v => i += v;

    $a.off($a.on($e, 'foo', cb));
    $e.emit('foo', 1);
    expect(i).toBe(0);
  });
  it('clearing of listeners by an implicit group', () => {
    let i = 0;

    const $a = new _async.default(),
          $e = new _eventemitter.EventEmitter2(),
          cb = v => i += v;

    $a.on($e, 'foo', cb);
    $a.on($e, 'foo', cb);
    $a.off({
      group: 'foo'
    });
    $e.emit('foo', 1);
    expect(i).toBe(0);
  });
  it('clearing of listeners by a group', () => {
    let i = 0;

    const $a = new _async.default(),
          $e = new _eventemitter.EventEmitter2(),
          cb = v => i += v;

    $a.on($e, 'foo', cb, {
      group: 'baz'
    });
    $a.on($e, 'foo', cb, {
      group: 'baz'
    });
    $a.off({
      group: 'baz'
    });
    $e.emit('foo', 1);
    expect(i).toBe(0);
  });
  it('muting of a listener', () => {
    let i = 0;

    const $a = new _async.default(),
          $e = new _eventemitter.EventEmitter2(),
          cb = v => i += v;

    $a.muteEventListener($a.on($e, 'foo', cb));
    $e.emit('foo', 1);
    $a.unmuteEventListener();
    $e.emit('foo', 2);
    expect(i).toBe(2);
  });
  it('suspending of a listener', () => {
    let i = 0;

    const $a = new _async.default(),
          $e = new _eventemitter.EventEmitter2(),
          cb = v => i += v;

    $a.suspendEventListener($a.on($e, 'foo', cb));
    $e.emit('foo', 1);
    $a.unsuspendEventListener();
    $e.emit('foo', 2);
    expect(i).toBe(3);
  });
  it('listeners with labels', () => {
    const onResolve = (res, label) => () => {
      res.push(label);
      return label;
    };

    const onReject = spy => err => spy(Object.select(err, ['type', 'reason'])),
          onMerge = (spy, label) => () => spy(label);

    {
      const $a = new _async.default(),
            $e = new _eventemitter.EventEmitter2(),
            spy = jest.fn(),
            res = [];
      $a.on($e, 'foo', onResolve(res, 'first'), {
        label: $$.foo,
        onClear: onReject(spy)
      });
      $a.on($e, 'foo', onResolve(res, 'second'), {
        label: $$.foo,
        onClear: onReject(spy)
      });
      $e.emit('foo');
      expect(res).toEqual(['second']);
      expect(spy).toHaveBeenCalledWith({
        type: 'clearAsync',
        reason: 'collision'
      });
    }
    {
      const $a = new _async.default(),
            $e = new _eventemitter.EventEmitter2(),
            spy = jest.fn(),
            res = [];
      $a.on($e, 'foo', onResolve(res, 'first'), {
        label: $$.foo,
        join: true,
        onMerge: onMerge(spy, 'first')
      });
      $a.on($e, 'foo', onResolve(res, 'second'), {
        label: $$.foo,
        join: true,
        onMerge: onMerge(spy, 'second')
      });
      $e.emit('foo');
      expect(res).toEqual(['first']);
      expect(spy).toHaveBeenCalledWith('second');
    }
    {
      const $a = new _async.default(),
            $e = new _eventemitter.EventEmitter2(),
            spy = jest.fn(),
            res = [];
      $a.on($e, 'foo', onResolve(res, 'first'), {
        label: $$.foo,
        join: 'replace',
        onClear: onReject(spy)
      });
      $a.on($e, 'foo', onResolve(res, 'second'), {
        label: $$.foo,
        join: 'replace',
        onClear: onReject(spy)
      });
      $e.emit('foo');
      expect(res).toEqual(['second']);
      expect(spy).toHaveBeenCalledWith({
        type: 'clearAsync',
        reason: 'collision'
      });
    }
  });
  it('promisifyOnce', done => {
    let i = 0;
    const $a = new _async.default(),
          $e = new _eventemitter.EventEmitter2();
    $a.promisifyOnce($e, 'bla').then(() => i++, stderr);
    $a.promisifyOnce($e, 'bla', {
      group: 'foo'
    }).then(() => i++, stderr);
    $a.promisifyOnce($e, 'bla', {
      group: 'bar'
    }).then(() => i++, stderr);
    $a.clearPromise({
      group: 'foo'
    });
    $a.suspendPromise({
      group: 'foo'
    });
    $e.emit('bla');
    $e.emit('bla');
    setTimeout(() => {
      $a.unsuspendPromise();
      expect(i).toBe(2);
      done();
    }, 15);
  });
  it('return value of `promisifyOnce`', async () => {
    const $a = new _async.default(),
          $e = new _eventemitter.EventEmitter2();
    const val = $a.promisifyOnce($e, 'bla');
    $e.emit('bla', 1);
    expect(await val).toBe(1);
  });
});
