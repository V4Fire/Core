/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { PerfTimersRunner } from 'core/perf/timer/impl';

describe('core/perf/timer/impl', () => {
	let testEngine;

	beforeEach(() => {
		const timerTestEngine = {sendDelta: jest.fn(), getTimestampFromTimeOrigin: jest.fn()};
		testEngine = timerTestEngine;
	});

	describe('timer method', () => {
		describe('`start`', () => {
			it('does not send a delta', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				timer.start('metrics');
				expect(testEngine.sendDelta).not.toHaveBeenCalled();
			});

			it('returns a timerId if no filters defined', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				const timerId = timer.start('metrics');
				expect(timerId).toBeTruthy();
			});

			it('returns different timerIds for the same timer and the same metrics name', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				const timerIds = new Set();
				for (let i = 0; i < 10; ++i) {
					timerIds.add(timer.start('metrics'));
				}

				expect(timerIds.size).toBe(10);
			});

			it('returns different timerIds for the same timer and different metrics names', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				const timerIds = new Set();
				for (let i = 0; i < 10; ++i) {
					timerIds.add(timer.start(`metrics-${i}`));
				}

				expect(timerIds.size).toBe(10);
			});

			it('returns a timerId if matches a filter predicate', () => {
				const runner = new PerfTimersRunner(testEngine, {filter: (ns) => ns.startsWith('manual')});
				const timer = runner.createTimer('manual');
				const timerId = timer.start('metrics');
				expect(timerId).toBeTruthy();
			});

			it('returns `undefined` if does not match a filter predicate', () => {
				const runner = new PerfTimersRunner(testEngine, {filter: (ns) => ns.startsWith('network')});
				const timer = runner.createTimer('manual');
				const timerId = timer.start('metrics');
				expect(timerId).toBe(undefined);
			});

			it('throws an exception if metrics name is not defined', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				expect(() => timer.start(undefined)).toThrowError('The metrics name should be defined');
			});

			it('throws an exception if metrics name is empty', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				expect(() => timer.start('')).toThrowError('The metrics name should be defined');
			});
		});

		describe('`finish`', () => {
			it('sends a delta with full metrics name', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(0);
				const timerId = timer.start('metrics');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				timer.finish(timerId);
				expect(testEngine.sendDelta).toHaveBeenLastCalledWith('manual.metrics', 1, undefined);
			});

			it('sends additional data along with a delta', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(0);
				const timerId = timer.start('metrics');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				timer.finish(timerId, {name: 'secret'});
				expect(testEngine.sendDelta).toHaveBeenLastCalledWith('manual.metrics', 1, {name: 'secret'});
			});

			it('does not send a delta if the metric does not match a filter predicate', () => {
				const runner = new PerfTimersRunner(testEngine, {filter: (ns) => ns.startsWith('network')});
				const timer = runner.createTimer('manual');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(0);
				const timerId = timer.start('metrics');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				timer.finish(timerId);
				expect(testEngine.sendDelta).not.toHaveBeenCalled();
			});

			it('does not send a delta if timerId is undefined', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				timer.finish(undefined);
				expect(testEngine.sendDelta).not.toHaveBeenCalled();
			});

			it('does not send a delta if passed timerId is not real timerId', () => {
				jest.spyOn(console, 'warn');
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				timer.finish('my-own-timer-id');
				expect(testEngine.sendDelta).not.toHaveBeenCalled();
				expect(console.warn).toHaveBeenCalled();
			});

			it('does not send a delta after second call with the same timerId', () => {
				jest.spyOn(console, 'warn');
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(0);
				const timerId = timer.start('metrics');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				timer.finish(timerId);
				expect(console.warn).not.toHaveBeenCalled();
				timer.finish(timerId);
				expect(testEngine.sendDelta).toHaveBeenLastCalledWith('manual.metrics', 1, undefined);
				expect(console.warn).toHaveBeenCalled();
			});

			it('is not affected by scoped runner', () => {
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				const runner = new PerfTimersRunner(testEngine, {withCurrentTimeOrigin: true});
				const timer = runner.createTimer('manual');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				const timerId = timer.start('metrics');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(2);
				timer.finish(timerId);
				expect(testEngine.sendDelta).toHaveBeenLastCalledWith('manual.metrics', 1, undefined);
			});
		});

		describe('`markTimestamp`', () => {
			it('sends a delta with full metrics name', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				timer.markTimestamp('mark');
				expect(testEngine.sendDelta).toHaveBeenLastCalledWith('manual.mark', 1, undefined);
			});

			it('sends additional data along with a delta', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				timer.markTimestamp('mark', {title: 'none'});
				expect(testEngine.sendDelta).toHaveBeenLastCalledWith('manual.mark', 1, {title: 'none'});
			});

			it('sends a delta if matches a filter predicate', () => {
				const runner = new PerfTimersRunner(testEngine, {filter: (ns) => ns.startsWith('manual')});
				const timer = runner.createTimer('manual');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				timer.markTimestamp('mark');
				expect(testEngine.sendDelta).toHaveBeenLastCalledWith('manual.mark', 1, undefined);
			});

			it('throws an exception if metrics name is not defined', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				expect(() => timer.markTimestamp(undefined)).toThrowError();
			});

			it('throws an exception if metrics name is empty', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('manual');
				expect(() => timer.markTimestamp('')).toThrowError();
			});

			it('does not send a delta if does not match a filter predicate', () => {
				const runner = new PerfTimersRunner(testEngine, {filter: (ns) => ns.startsWith('network')});
				const timer = runner.createTimer('manual');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				timer.markTimestamp('mark');
				expect(testEngine.sendDelta).not.toHaveBeenCalled();
			});

			it('is affected by scoped runner when is called right after creating of the runner', () => {
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				const runner = new PerfTimersRunner(testEngine, {withCurrentTimeOrigin: true});
				const timer = runner.createTimer('manual');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				timer.markTimestamp('mark');
				expect(testEngine.sendDelta).toHaveBeenLastCalledWith('manual.mark', 0, undefined);
			});

			it('is affected by scoped runner when is called in some time after creating of the runner', () => {
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				const runner = new PerfTimersRunner(testEngine, {withCurrentTimeOrigin: true});
				const timer = runner.createTimer('manual');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(3);
				timer.markTimestamp('mark');
				expect(testEngine.sendDelta).toHaveBeenLastCalledWith('manual.mark', 2, undefined);
			});
		});

		describe('`namespace`', () => {
			it('enriches the namespace for `markTimestamp` method', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('network').namespace('auth');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				timer.markTimestamp('attach-headers');
				expect(testEngine.sendDelta).toHaveBeenLastCalledWith('network.auth.attach-headers', 1, undefined);
			});

			it('enriches the namespace for `markTimestamp` method several times in a row', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner
					.createTimer('network')
					.namespace('auth')
					.namespace('v1')
					.namespace('api');

				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				timer.markTimestamp('attach-headers');
				expect(testEngine.sendDelta).toHaveBeenLastCalledWith('network.auth.v1.api.attach-headers', 1, undefined);
			});

			it('creates another timer instance which `markTimestamp` method does not affect the same method of the previous timer', () => {
				const runner = new PerfTimersRunner(testEngine);
				const baseTimer = runner.createTimer('network');
				const specificTimer = baseTimer.namespace('v1');

				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				specificTimer.markTimestamp('attach-headers');

				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(2);
				baseTimer.markTimestamp('attach-headers');

				expect(testEngine.sendDelta.mock.calls).toEqual(
					[
						['network.v1.attach-headers', 1, undefined],
						['network.attach-headers', 2, undefined]
					]
				);
			});

			it('enriches the namespace for `start`/`finish` methods', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('network').namespace('auth');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(0);
				const timerId = timer.start('login');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				timer.finish(timerId);
				expect(testEngine.sendDelta).toHaveBeenLastCalledWith('network.auth.login', 1, undefined);
			});

			it('enriches the namespace for `start`/`finish` methods several times in a row', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner
					.createTimer('network')
					.namespace('auth')
					.namespace('v1')
					.namespace('api');

				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(0);
				const timerId = timer.start('login');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				timer.finish(timerId);
				expect(testEngine.sendDelta).toHaveBeenLastCalledWith('network.auth.v1.api.login', 1, undefined);
			});

			it('creates another timer instance which `start`/`finish` methods do not affect the same methods of the previous timer', () => {
				const runner = new PerfTimersRunner(testEngine);
				const baseTimer = runner.createTimer('network');
				const specificTimer = baseTimer.namespace('auth');

				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(0);
				const specificTimerId = specificTimer.start('login');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(1);
				specificTimer.finish(specificTimerId);

				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(2);
				const baseTimerId = baseTimer.start('login');
				testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(4);
				baseTimer.finish(baseTimerId);

				expect(testEngine.sendDelta.mock.calls).toEqual(
					[
						['network.auth.login', 1, undefined],
						['network.login', 2, undefined]
					]
				);
			});

			it('does not send a delta', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('network');
				timer.namespace('auth');
				expect(testEngine.sendDelta).not.toHaveBeenCalled();
			});

			it('throws an exception if passed namespace is undefined', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('network');
				expect(() => timer.namespace(undefined)).toThrowError();
			});

			it('throws an exception if passed namespace is empty', () => {
				const runner = new PerfTimersRunner(testEngine);
				const timer = runner.createTimer('network');
				expect(() => timer.namespace('')).toThrowError();
			});
		});
	});

	describe('scenario', () => {
		it('concurrent `start`/`finish` metrics with the same name are not messed up', () => {
			const runner = new PerfTimersRunner(testEngine);
			const timer = runner.createTimer('components');

			testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(0);
			const firstTimerId = timer.start('update');

			testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(2);
			const secondTimerId = timer.start('update');

			testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(3);
			timer.finish(firstTimerId);

			testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(4);
			timer.finish(secondTimerId);

			expect(testEngine.sendDelta.mock.calls).toEqual([['components.update', 3, undefined], ['components.update', 2, undefined]]);
		});

		it('`finish` method does not finish already started metrics with the same name', () => {
			const runner = new PerfTimersRunner(testEngine);
			const timer = runner.createTimer('components');
			testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(0);
			timer.start('update');

			testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(2);
			timer.start('update');

			testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(4);
			const timerId = timer.start('update');

			testEngine.getTimestampFromTimeOrigin.mockReturnValueOnce(6);
			timer.finish(timerId);
			expect(testEngine.sendDelta).toHaveBeenLastCalledWith('components.update', 2, undefined);
		});
	});
});
