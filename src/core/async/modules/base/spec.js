/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

describe('core/async/modules/base', () => {
	it('clearAll', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10);

		$a.setInterval(() => {
			i++;
		}, 5);

		const
			spy = jasmine.createSpy();

		$a.promise(Promise.resolve()).then(() => true, (err) => spy(Object.select(err, ['type', 'reason'])));
		$a.clearAll();

		setTimeout(() => {
			expect(i).toBe(0);
			expect(spy).toHaveBeenCalledWith({type: 'clearAsync', reason: 'all'});
			done();
		}, 15);
	});

	it('muteAll/unmuteAll', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10);

		$a.setInterval(() => {
			i++;
		}, 5);

		$a.muteAll();

		setTimeout(() => {
			expect(i).toBe(0);
			$a.unmuteAll();

			setTimeout(() => {
				expect(i).toBeGreaterThanOrEqual(2);
				$a.clearAll();
				done();
			}, 5);
		}, 5);
	});

	it('suspendAll/unsuspendAll', (done) => {
		const
			$e = new EventEmitter(),
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => i++, 10);
		$a.setInterval(() => i++, 5);
		$a.promise(Promise.resolve()).then(() => i++);
		$a.on($e, 'foo', () => i++);

		$a.suspendAll();
		$e.emit('foo');

		setTimeout(() => {
			expect(i).toBe(0);
			$a.unsuspendAll();

			setTimeout(() => {
				expect(i).toBeGreaterThanOrEqual(4);
				$a.clearAll();
				done();
			}, 5);
		}, 5);
	});
});
