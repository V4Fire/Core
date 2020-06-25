/* eslint-disable @typescript-eslint/strict-boolean-expressions */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';
import symbolGenerator from 'core/symbol';

const
	$$ = symbolGenerator();

describe('core/async/modules/timers', () => {
	[
		['timeout'],
		['interval'],
		['immediate'],
		['idleCallback', 'requestIdleCallback', 'cancelIdleCallback']
	].forEach(([method, reg, clear]) => {
		reg = reg || `set-${method}`.camelize(false);
		clear = clear || `clear-${method}`.camelize(false);

		const
			mute = `mute-${method}`.camelize(false),
			unmute = `un${mute}`;

		const
			suspend = `suspend-${method}`.camelize(false),
			unsuspend = `un${suspend}`;

		it(`simple ${method}`, (done) => {
			const
				$a = new Async();

			let
				i = 0;

			$a[reg](() => i++, 10);
			$a[clear]($a[reg](() => i++, 10));

			setTimeout(() => {
				const cb = () => {
					expect(i).toBe(1);
					$a.clearAll();
					done();
				};

				if (method === 'idleCallback') {
					requestIdleCallback(cb);

				} else {
					cb();
				}
			}, 15);
		});

		it(`muting of ${method}`, (done) => {
			const
				$a = new Async();

			let
				i = 0;

			$a[reg](() => i++, 10);
			$a[mute]($a[reg](() => i++, 10));

			setTimeout(() => {
				const cb = () => {
					$a[unmute]();
					expect(i).toBe(1);
					$a.clearAll();
					done();
				};

				if (method === 'idleCallback') {
					requestIdleCallback(cb);

				} else {
					cb();
				}
			}, 15);
		});

		it(`suspending of ${method}`, (done) => {
			const
				$a = new Async();

			let
				i = 0;

			$a[reg](() => i++, 10);
			$a[suspend]($a[reg](() => i++, 10));

			setTimeout(() => {
				const cb = () => {
					$a[unsuspend]();
					expect(i).toBe(2);
					$a.clearAll();
					done();
				};

				if (method === 'idleCallback') {
					requestIdleCallback(cb);

				} else {
					cb();
				}
			}, 15);
		});
	});
});
