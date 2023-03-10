"use strict";

var _timer = require("../../../core/perf/timer");

var _console = require("../../../core/perf/timer/engines/console");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/perf/timer', () => {
  beforeEach(() => {
    jest.spyOn(_console.consoleEngine, 'sendDelta');
  });
  describe('factory method', () => {
    describe('`getTimer`', () => {
      it('returns timers that work with the same timers runner when the same group is passed as the first argument', () => {
        const factory = (0, _timer.getTimerFactory)({
          engine: 'console'
        });
        const firstTimer = factory.getTimer('components');
        const firstTimerId = firstTimer.start('button');
        expect(firstTimerId).toBeTruthy();
        const secondTimer = factory.getTimer('components');
        const secondTimerId = secondTimer.start('button');
        expect(secondTimerId).toBeTruthy();
        secondTimer.finish(firstTimerId);
        firstTimer.finish(secondTimerId);
        expect(_console.consoleEngine.sendDelta).toHaveBeenCalledTimes(2);
      });
      it('returns timers that work with different timers runners when different groups are passed as the first argument', () => {
        jest.spyOn(console, 'warn');
        const factory = (0, _timer.getTimerFactory)({
          engine: 'console'
        });
        const firstTimer = factory.getTimer('components');
        const firstTimerId = firstTimer.start('auth');
        expect(firstTimerId).toBeTruthy();
        const secondTimer = factory.getTimer('network');
        const secondTimerId = secondTimer.start('auth');
        expect(secondTimerId).toBeTruthy();
        expect(console.warn).not.toHaveBeenCalled();
        secondTimer.finish(firstTimerId);
        firstTimer.finish(secondTimerId);
        expect(console.warn).toHaveBeenCalledTimes(2);
        expect(_console.consoleEngine.sendDelta).not.toHaveBeenCalled();
      });
      it('returns timers that do not work if they do not match to the passed filters settings', () => {
        const factory = (0, _timer.getTimerFactory)({
          engine: 'console',
          filters: {
            components: false
          }
        });
        const timer = factory.getTimer('components');
        const timerId = timer.start('button');
        expect(timerId).toBe(undefined);
      });
      it('returns timers that work only if they match to the passed filters settings', () => {
        const factory = (0, _timer.getTimerFactory)({
          engine: 'console',
          filters: {
            components: 'button$'
          }
        });
        const timer = factory.getTimer('components');
        const timerId = timer.start('button');
        expect(timerId).toBeTruthy();
      });
    });
    describe('`getScopedTimer`', () => {
      it('returns timers that work with the same timers runner when the same group and scope are passed as arguments', () => {
        const factory = (0, _timer.getTimerFactory)({
          engine: 'console'
        });
        const firstTimer = factory.getScopedTimer('components', 'main-page');
        const firstTimerId = firstTimer.start('button');
        expect(firstTimerId).toBeTruthy();
        const secondTimer = factory.getScopedTimer('components', 'main-page');
        const secondTimerId = secondTimer.start('button');
        expect(secondTimerId).toBeTruthy();
        secondTimer.finish(firstTimerId);
        firstTimer.finish(secondTimerId);
        expect(_console.consoleEngine.sendDelta).toHaveBeenCalledTimes(2);
      });
      it('returns timers that work with different timers runners when different groups but the same scope are passed as arguments', () => {
        jest.spyOn(console, 'warn');
        const factory = (0, _timer.getTimerFactory)({
          engine: 'console'
        });
        const firstTimer = factory.getScopedTimer('components', 'main-page');
        const firstTimerId = firstTimer.start('auth');
        expect(firstTimerId).toBeTruthy();
        const secondTimer = factory.getScopedTimer('network', 'main-page');
        const secondTimerId = secondTimer.start('auth');
        expect(secondTimerId).toBeTruthy();
        expect(console.warn).not.toHaveBeenCalled();
        secondTimer.finish(firstTimerId);
        firstTimer.finish(secondTimerId);
        expect(console.warn).toHaveBeenCalledTimes(2);
        expect(_console.consoleEngine.sendDelta).not.toHaveBeenCalled();
      });
      it('returns timers that work with different timers runners when the same group but different scopes are passed as arguments', () => {
        jest.spyOn(console, 'warn');
        const factory = (0, _timer.getTimerFactory)({
          engine: 'console'
        });
        const firstTimer = factory.getScopedTimer('components', 'main-page');
        const firstTimerId = firstTimer.start('auth');
        expect(firstTimerId).toBeTruthy();
        const secondTimer = factory.getScopedTimer('components', 'secondary-page');
        const secondTimerId = secondTimer.start('auth');
        expect(secondTimerId).toBeTruthy();
        expect(console.warn).not.toHaveBeenCalled();
        secondTimer.finish(firstTimerId);
        firstTimer.finish(secondTimerId);
        expect(console.warn).toHaveBeenCalledTimes(2);
        expect(_console.consoleEngine.sendDelta).not.toHaveBeenCalled();
      });
      it('returns timers that do not work if they do not match to the passed filters settings', () => {
        const factory = (0, _timer.getTimerFactory)({
          engine: 'console',
          filters: {
            components: false
          }
        });
        const timer = factory.getScopedTimer('components', 'main-page');
        const timerId = timer.start('auth');
        expect(timerId).toBe(undefined);
      });
      it('returns timers that work only if they match to the passed filters settings', () => {
        const factory = (0, _timer.getTimerFactory)({
          engine: 'console',
          filters: {
            components: 'button$'
          }
        });
        const timer = factory.getScopedTimer('components', 'main-page');
        const timerId = timer.start('auth');
        expect(timerId).toBeTruthy();
      });
    });
  });
  describe('several factories', () => {
    it('create different timers runners for the same group', () => {
      jest.spyOn(console, 'warn');
      const firstFactory = (0, _timer.getTimerFactory)({
        engine: 'console'
      });
      const secondFactory = (0, _timer.getTimerFactory)({
        engine: 'console'
      });
      const firstTimer = firstFactory.getTimer('manual');
      const firstTimerId = firstTimer.start('test');
      expect(firstTimerId).toBeTruthy();
      const secondTimer = secondFactory.getTimer('manual');
      const secondTimerId = secondTimer.start('test');
      expect(secondTimerId).toBeTruthy();
      expect(console.warn).not.toHaveBeenCalled();
      secondTimer.finish(firstTimerId);
      firstTimer.finish(secondTimerId);
      expect(console.warn).toHaveBeenCalledTimes(2);
      expect(_console.consoleEngine.sendDelta).not.toHaveBeenCalled();
    });
    it('create different timers runners for the different groups', () => {
      jest.spyOn(console, 'warn');
      const firstFactory = (0, _timer.getTimerFactory)({
        engine: 'console'
      });
      const secondFactory = (0, _timer.getTimerFactory)({
        engine: 'console'
      });
      const firstTimer = firstFactory.getTimer('manual');
      const firstTimerId = firstTimer.start('testing');
      expect(firstTimerId).toBeTruthy();
      const secondTimer = secondFactory.getTimer('network');
      const secondTimerId = secondTimer.start('testing');
      expect(secondTimerId).toBeTruthy();
      expect(console.warn).not.toHaveBeenCalled();
      secondTimer.finish(firstTimerId);
      firstTimer.finish(secondTimerId);
      expect(console.warn).toHaveBeenCalledTimes(2);
      expect(_console.consoleEngine.sendDelta).not.toHaveBeenCalled();
    });
    it('create different scoped timers runners for the same group and scope', () => {
      jest.spyOn(console, 'warn');
      const firstFactory = (0, _timer.getTimerFactory)({
        engine: 'console'
      });
      const secondFactory = (0, _timer.getTimerFactory)({
        engine: 'console'
      });
      const firstTimer = firstFactory.getScopedTimer('manual', 'helpers');
      const firstTimerId = firstTimer.start('parsing');
      expect(firstTimerId).toBeTruthy();
      const secondTimer = secondFactory.getTimer('manual', 'helpers');
      const secondTimerId = secondTimer.start('parsing');
      expect(secondTimerId).toBeTruthy();
      expect(console.warn).not.toHaveBeenCalled();
      secondTimer.finish(firstTimerId);
      firstTimer.finish(secondTimerId);
      expect(console.warn).toHaveBeenCalledTimes(2);
      expect(_console.consoleEngine.sendDelta).not.toHaveBeenCalled();
    });
    it('create different scoped timers runners for different groups but the same scope', () => {
      jest.spyOn(console, 'warn');
      const firstFactory = (0, _timer.getTimerFactory)({
        engine: 'console'
      });
      const secondFactory = (0, _timer.getTimerFactory)({
        engine: 'console'
      });
      const firstTimer = firstFactory.getScopedTimer('manual', 'helpers');
      const firstTimerId = firstTimer.start('auth');
      expect(firstTimerId).toBeTruthy();
      const secondTimer = secondFactory.getScopedTimer('tools', 'helpers');
      const secondTimerId = secondTimer.start('auth');
      expect(secondTimerId).toBeTruthy();
      expect(console.warn).not.toHaveBeenCalled();
      secondTimer.finish(firstTimerId);
      firstTimer.finish(secondTimerId);
      expect(console.warn).toHaveBeenCalledTimes(2);
      expect(_console.consoleEngine.sendDelta).not.toHaveBeenCalled();
    });
    it('create different scoped timers runners for the same group but different scopes', () => {
      jest.spyOn(console, 'warn');
      const firstFactory = (0, _timer.getTimerFactory)({
        engine: 'console'
      });
      const secondFactory = (0, _timer.getTimerFactory)({
        engine: 'console'
      });
      const firstTimer = firstFactory.getScopedTimer('manual', 'initialization');
      const firstTimerId = firstTimer.start('auth');
      expect(firstTimerId).toBeTruthy();
      const secondTimer = secondFactory.getScopedTimer('manual', 'destruction');
      const secondTimerId = secondTimer.start('auth');
      expect(secondTimerId).toBeTruthy();
      expect(console.warn).not.toHaveBeenCalled();
      secondTimer.finish(firstTimerId);
      firstTimer.finish(secondTimerId);
      expect(console.warn).toHaveBeenCalledTimes(2);
      expect(_console.consoleEngine.sendDelta).not.toHaveBeenCalled();
    });
  });
});