"use strict";

var _console = require("../../../../core/perf/timer/engines/console");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/perf/timer/engines/console', () => {
  describe('`sendDelta`', () => {
    it('calls `console.warn`', () => {
      spyOn(console, 'warn');

      _console.consoleEngine.sendDelta('login', 3);

      expect(console.warn).toHaveBeenCalledOnceWith('login took 3 ms');
    });
    it('calls `console.warn` with additional data', () => {
      spyOn(console, 'warn');

      _console.consoleEngine.sendDelta('login', 5, {
        title: 'secret'
      });

      expect(console.warn).toHaveBeenCalledOnceWith('login took 5 ms', {
        title: 'secret'
      });
    });
    it('does not call `console.log`', () => {
      // Prevents warn from appearing in console
      spyOn(console, 'warn');
      spyOn(console, 'log');

      _console.consoleEngine.sendDelta('login', 1);

      expect(console.log).not.toHaveBeenCalled();
    });
    it('does not call `console.error`', () => {
      // Prevents warn from appearing in console
      spyOn(console, 'warn');
      spyOn(console, 'error');

      _console.consoleEngine.sendDelta('login', 1);

      expect(console.error).not.toHaveBeenCalled();
    });
  });
  describe('`getTimestampFromTimeOrigin`', () => {
    it('returns result of type Number', () => {
      expect(_console.consoleEngine.getTimestampFromTimeOrigin()).toEqual(jasmine.any(Number));
    });
  });
});