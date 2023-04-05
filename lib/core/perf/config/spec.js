"use strict";

var _perf = require("../../../core/perf");
describe('core/perf', () => {
  it('providing an engine to use', () => {
    const spy = jest.spyOn(console, 'warn');
    const perf = (0, _perf.perf)({
      timer: {
        engine: 'console'
      }
    });
    const timer = perf.getTimer('network').namespace('auth');
    const timerId = timer.start('start');
    timer.finish(timerId);
    expect(spy).toHaveBeenCalledTimes(1);
    const timerId2 = timer.start('end');
    timer.finish(timerId2);
    expect(spy).toHaveBeenCalledTimes(2);
  });
  it('should log only filtered events', () => {
    const spy = jest.spyOn(console, 'warn');
    const perf = (0, _perf.perf)({
      timer: {
        engine: 'console',
        filters: {
          network: ['start']
        }
      }
    });
    const timer = perf.getTimer('network').namespace('auth');
    const timerId = timer.start('start');
    timer.finish(timerId);
    expect(spy).toHaveBeenCalledTimes(1);
    const timerId2 = timer.start('end');
    timer.finish(timerId2);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should filter namespaces too', () => {
    const spy = jest.spyOn(console, 'warn');
    const perf = (0, _perf.perf)({
      timer: {
        engine: 'console',
        filters: {
          network: ['start']
        }
      }
    });
    const timer = perf.getTimer('network').namespace('start');
    const timerId = timer.start('anything');
    timer.finish(timerId);
    expect(spy).toHaveBeenCalledTimes(1);
    const timer2 = perf.getTimer('network').namespace('finish');
    const timerId2 = timer2.start('anything');
    timer2.finish(timerId2);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should filter only `manual`', () => {
    const spy = jest.spyOn(console, 'warn');
    const perf = (0, _perf.perf)({
      timer: {
        engine: 'console',
        filters: {
          manual: ['start']
        }
      }
    });
    const timer = perf.getTimer('network').namespace('click');
    const timerId = timer.start('start');
    timer.finish(timerId);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should log only filtered events provided via `include`', () => {
    const spy = jest.spyOn(console, 'warn');
    const perf = (0, _perf.perf)({
      timer: {
        engine: 'console',
        filters: {
          components: {
            include: ['start', 'finish']
          }
        }
      }
    });
    const timer = perf.getTimer('components').namespace('auth');
    const timerId = timer.start('start');
    timer.finish(timerId);
    expect(spy).toHaveBeenCalledTimes(1);
    const timerId2 = timer.start('end');
    timer.finish(timerId2);
    expect(spy).toHaveBeenCalledTimes(1);
    const timerId3 = timer.start('finish');
    timer.finish(timerId3);
    expect(spy).toHaveBeenCalledTimes(2);
  });
  it("shouldn't log events provided via `exclude`", () => {
    const spy = jest.spyOn(console, 'warn');
    const perf = (0, _perf.perf)({
      timer: {
        engine: 'console',
        filters: {
          tools: {
            exclude: ['start', 'end']
          }
        }
      }
    });
    const timer = perf.getTimer('tools').namespace('anything');
    const timerId = timer.start('start');
    timer.finish(timerId);
    expect(spy).toHaveBeenCalledTimes(0);
    const timerId2 = timer.start('end');
    timer.finish(timerId2);
    expect(spy).toHaveBeenCalledTimes(0);
    const timerId3 = timer.start('intermediate');
    timer.finish(timerId3);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should ignore `exclude` if provided `include`', () => {
    const spy = jest.spyOn(console, 'warn');
    const perf = (0, _perf.perf)({
      timer: {
        engine: 'console',
        filters: {
          manual: {
            include: ['end', 'start'],
            exclude: ['start']
          }
        }
      }
    });
    const timer = perf.getTimer('manual').namespace('click');
    const timerId = timer.start('start');
    timer.finish(timerId);
    expect(spy).toHaveBeenCalledTimes(1);
    const timerId2 = timer.start('end');
    timer.finish(timerId2);
    expect(spy).toHaveBeenCalledTimes(2);
    const timerId3 = timer.start('anything');
    timer.finish(timerId3);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});