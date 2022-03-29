/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import {perf as perfFactory} from 'core/perf';

describe('core/perf', () => {
	it('old pattern', () => {
		const spy = spyOn(console, 'warn');

		const perf = perfFactory({
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

	it('include pattern', () => {
		const spy = spyOn(console, 'warn');

		const perf = perfFactory({
			timer: {
				engine: 'console',
				filters: {
					components: {
						include: ['start']
					}
				}
			}
		});

		const timer = perf.getTimer('components').namespace('render');

		const timerId = timer.start('start');
		timer.finish(timerId);

		expect(spy).toHaveBeenCalledTimes(1);

		const timerId2 = timer.start('end');
		timer.finish(timerId2);

		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('exclude pattern', () => {
		const spy = spyOn(console, 'warn');

		const perf = perfFactory({
			timer: {
				engine: 'console',
				filters: {
					tools: {
						exclude: ['start']
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

		expect(spy).toHaveBeenCalledTimes(1);

		const timerId3 = timer.start('intermediate');
		timer.finish(timerId3);

		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('include and exclude, exclude is ignored', () => {
		const spy = spyOn(console, 'warn');

		const perf = perfFactory({
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
	});
});
