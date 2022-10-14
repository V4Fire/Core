/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { consoleEngine } from 'core/perf/timer/engines/console';

describe('core/perf/timer/engines/console', () => {
	describe('`sendDelta`', () => {
		it('calls `console.warn`', () => {
			const spy = jest.spyOn(console, 'warn');
			consoleEngine.sendDelta('login', 3);

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenLastCalledWith('login took 3 ms');
		});

		it('calls `console.warn` with additional data', () => {
			const spy = jest.spyOn(console, 'warn');
			consoleEngine.sendDelta('login', 5, {title: 'secret'});

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenLastCalledWith('login took 5 ms', {title: 'secret'});
		});

		it('does not call `console.log`', () => {
			// Prevents warn from appearing in console
			jest.spyOn(console, 'warn');
			jest.spyOn(console, 'log');
			consoleEngine.sendDelta('login', 1);

			expect(console.log).not.toHaveBeenCalled();
		});

		it('does not call `console.error`', () => {
			// Prevents warn from appearing in console
			jest.spyOn(console, 'warn');
			jest.spyOn(console, 'error');
			consoleEngine.sendDelta('login', 1);

			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('`getTimestampFromTimeOrigin`', () => {
		it('returns result of type Number', () => {
			expect(typeof consoleEngine.getTimestampFromTimeOrigin()).toBe('number');
		});
	});
});
