"use strict";

var _console = require("../../../../core/perf/timer/engines/console");
describe('core/perf/timer/engines/console', () => {
  describe('`sendDelta`', () => {
    it('calls `console.warn`', () => {
      const spy = jest.spyOn(console, 'warn');
      _console.consoleEngine.sendDelta('login', 3);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('login took 3 ms');
    });
    it('calls `console.warn` with additional data', () => {
      const spy = jest.spyOn(console, 'warn');
      _console.consoleEngine.sendDelta('login', 5, {
        title: 'secret'
      });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith('login took 5 ms', {
        title: 'secret'
      });
    });
    it('does not call `console.log`', () => {
      jest.spyOn(console, 'warn');
      jest.spyOn(console, 'log');
      _console.consoleEngine.sendDelta('login', 1);
      expect(console.log).not.toHaveBeenCalled();
    });
    it('does not call `console.error`', () => {
      jest.spyOn(console, 'warn');
      jest.spyOn(console, 'error');
      _console.consoleEngine.sendDelta('login', 1);
      expect(console.error).not.toHaveBeenCalled();
    });
  });
  describe('`getTimestampFromTimeOrigin`', () => {
    it('returns result of type Number', () => {
      expect(typeof _console.consoleEngine.getTimestampFromTimeOrigin()).toBe('number');
    });
  });
});