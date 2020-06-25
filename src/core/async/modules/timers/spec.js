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
			args = [];

		if (method === 'timeout' || method === 'interval') {
			args.push(10);
		}

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

			$a[reg](() => i++, ...args);
			$a[clear]($a[reg](() => i++, ...args));

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

			$a[reg](() => i++, ...args);
			$a[mute]($a[reg](() => i++, ...args));

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

			$a[reg](() => i++, ...args);
			$a[suspend]($a[reg](() => i++, ...args));

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

		const onResolve = (res, label) => () => {
			res.push(label);
			return label;
		};

		const
			onReject = (spy) => (err) => spy(Object.select(err, ['type', 'reason'])),
			onMerge = (spy, label) => () => spy(label);

		it(`${method} with labels`, (done) => {
			const
				$a = new Async(),
				spy = jasmine.createSpy(),
				res = [];

			$a[reg](onResolve(res, 'first'), ...args, {label: $$.foo, onClear: onReject(spy)});
			$a[reg](onResolve(res, 'second'), ...args, {label: $$.foo, onClear: onReject(spy)});

			setTimeout(() => {
				const cb = () => {
					expect(res).toEqual(['second']);
					expect(spy).toHaveBeenCalledWith({type: 'clearAsync', reason: 'collision'});
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

		it(`${method} with labels and joining`, (done) => {
			const
				$a = new Async(),
				spy = jasmine.createSpy(),
				res = [];

			$a[reg](onResolve(res, 'first'), ...args, {label: $$.foo, join: true, onMerge: onMerge(spy, 'first')});
			$a[reg](onResolve(res, 'second'), ...args, {label: $$.foo, join: true, onMerge: onMerge(spy, 'second')});

			setTimeout(() => {
				const cb = () => {
					expect(res).toEqual(['first']);
					expect(spy).toHaveBeenCalledWith('second');
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

		it(`${method} with labels and replacing`, (done) => {
			const
				$a = new Async(),
				spy = jasmine.createSpy(),
				res = [];

			$a[reg](onResolve(res, 'first'), ...args, {label: $$.foo, join: 'replace', onClear: onReject(spy)});
			$a[reg](onResolve(res, 'second'), ...args, {label: $$.foo, join: 'replace', onClear: onReject(spy)});

			setTimeout(() => {
				const cb = () => {
					expect(res).toEqual(['second']);
					expect(spy).toHaveBeenCalledWith({type: 'clearAsync', reason: 'collision'});
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

	it('requestIdleCallback', (done) => {
		const
			$a = new Async(),
			spy = jasmine.createSpy();

		$a.requestIdleCallback((info) => spy(info instanceof IdleDeadline));

		requestIdleCallback(() => {
			expect(spy).toHaveBeenCalledWith(true);
			done();
		});
	});
});
