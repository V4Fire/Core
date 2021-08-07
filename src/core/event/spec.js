/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import { resolveAfterEvents, createsAsyncSemaphore } from 'core/event';

describe('core/event', () => {
	it('`resolveAfterEvents`', (done) => {
		const
			emitter = new EventEmitter(),
			promise = resolveAfterEvents(emitter, 'foo', 'bar');

		let
			i = 0;

		promise.then(() => {
			expect(i).toBe(2);
			done();
		});

		emitter.onAny(() => {
			i++;
		});

		emitter.emit('foo');
		emitter.emit('bar');
	});

	it('`createsAsyncSemaphore`', () => {
		let
			i = 0;

		const semaphore = createsAsyncSemaphore(() => {
			i++;
		}, 'foo', 'bar');

		semaphore('foo');

		expect(i).toBe(0);

		semaphore('bar');

		expect(i).toBe(1);

		semaphore('bar');

		expect(i).toBe(1);
	});
});
