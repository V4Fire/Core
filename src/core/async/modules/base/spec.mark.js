/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

describe('core/async/modules/base/mark', () => {
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

	it('muteAll/unmuteAll by a group', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10);

		$a.setInterval(() => {
			i++;
		}, 5, {group: 'foo'});

		$a.muteAll({group: 'foo'});

		setTimeout(() => {
			expect(i).toBe(1);
			$a.unmuteAll({group: 'foo'});

			setTimeout(() => {
				expect(i).toBeGreaterThanOrEqual(2);
				$a.clearAll();
				done();
			}, 5);
		}, 15);
	});

	it('muteAll/unmuteAll by a regexp group', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10, {group: 'foo1'});

		$a.setInterval(() => {
			i++;
		}, 5, {group: 'foo2'});

		$a.muteAll({group: /foo/});

		setTimeout(() => {
			expect(i).toBe(0);
			$a.unmuteAll({group: /foo/});

			setTimeout(() => {
				expect(i).toBeGreaterThanOrEqual(1);
				$a.clearAll();
				done();
			}, 5);
		}, 15);
	});

	it('muteAll/unmuteAll by a label', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10);

		$a.setInterval(() => {
			i++;
		}, 5, {label: 'foo'});

		$a.muteAll({label: 'foo'});

		setTimeout(() => {
			expect(i).toBe(1);
			$a.unmuteAll({label: 'foo'});

			setTimeout(() => {
				expect(i).toBeGreaterThanOrEqual(2);
				$a.clearAll();
				done();
			}, 5);
		}, 15);
	});

	it('muteAll/unmuteAll by a label', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10);

		$a.setInterval(() => {
			i++;
		}, 5, {label: 'foo'});

		$a.muteAll({label: 'foo'});

		setTimeout(() => {
			expect(i).toBe(1);
			$a.unmuteAll({label: 'foo'});

			setTimeout(() => {
				expect(i).toBeGreaterThanOrEqual(2);
				$a.clearAll();
				done();
			}, 5);
		}, 15);
	});

	it('muteAll/unmuteAll by a group and label', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10, {group: 'foo', label: 'foo'});

		$a.setInterval(() => {
			i++;
		}, 5, {group: 'foo'});

		$a.muteAll({group: 'foo'});

		setTimeout(() => {
			expect(i).toBe(0);
			$a.unmuteAll({group: 'foo'});

			setTimeout(() => {
				expect(i).toBeGreaterThanOrEqual(1);
				$a.clearAll();
				done();
			}, 5);
		}, 15);
	});

	it('muteAll/unmuteAll by a label and group', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10, {label: 'foo'});

		$a.setInterval(() => {
			i++;
		}, 5, {group: 'foo', label: 'foo'});

		$a.muteAll({group: 'foo', label: 'foo'});

		setTimeout(() => {
			expect(i).toBe(1);
			$a.unmuteAll({group: 'foo', label: 'foo'});

			setTimeout(() => {
				expect(i).toBeGreaterThanOrEqual(2);
				$a.clearAll();
				done();
			}, 5);
		}, 15);
	});

	it('suspendAll/unsuspendAll', (done) => {
		const
			$e = new EventEmitter(),
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10);

		$a.setInterval(() => {
			i++;
		}, 5);

		$a.promise(Promise.resolve()).then(() => {
			i++;
		});

		$a.on($e, 'event', () => {
			i++;
		});

		$a.suspendAll();
		$e.emit('event');

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

	it('suspendAll/unsuspendAll by a group', (done) => {
		const
			$e = new EventEmitter(),
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10, {group: 'foo'});

		$a.promise(Promise.resolve()).then(() => {
			i++;
		});

		$a.on($e, 'event', () => {
			i++;
		});

		$a.suspendAll({group: 'foo'});
		$e.emit('event');

		setTimeout(() => {
			expect(i).toBe(2);
			$a.unsuspendAll({group: 'foo'});

			setTimeout(() => {
				expect(i).toBe(3);
				$a.clearAll();
				done();
			}, 5);
		}, 15);
	});

	it('suspendAll/unsuspendAll by a regexp group', (done) => {
		const
			$e = new EventEmitter(),
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10, {group: 'foo1'});

		$a.promise(Promise.resolve(), {group: 'foo2'}).then(() => {
			i++;
		});

		$a.on($e, 'event', () => {
			i++;
		});

		$a.suspendAll({group: /foo/});
		$e.emit('event');

		setTimeout(() => {
			expect(i).toBe(1);
			$a.unsuspendAll({group: /foo/});

			setTimeout(() => {
				expect(i).toBe(3);
				$a.clearAll();
				done();
			}, 5);
		}, 15);
	});

	it('suspendAll/unsuspendAll by a label', (done) => {
		const
			$e = new EventEmitter(),
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10, {label: 'foo'});

		$a.promise(Promise.resolve()).then(() => {
			i++;
		});

		$a.on($e, 'event', () => {
			i++;
		});

		$a.suspendAll({label: 'foo'});
		$e.emit('event');

		setTimeout(() => {
			expect(i).toBe(2);
			$a.unsuspendAll({label: 'foo'});

			setTimeout(() => {
				expect(i).toBe(3);
				$a.clearAll();
				done();
			}, 5);
		}, 15);
	});

	it('suspendAll/unsuspendAll by a group and label', (done) => {
		const
			$e = new EventEmitter(),
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10, {group: 'foo', label: 'foo'});

		$a.promise(Promise.resolve()).then(() => {
			i++;
		});

		$a.on($e, 'event', () => {
			i++;
		}, {group: 'foo'});

		$a.suspendAll({group: 'foo'});
		$e.emit('event');

		setTimeout(() => {
			expect(i).toBe(1);
			$a.unsuspendAll({group: 'foo'});

			setTimeout(() => {
				expect(i).toBe(3);
				$a.clearAll();
				done();
			}, 5);
		}, 15);
	});

	it('suspendAll/unsuspendAll by a label and group', (done) => {
		const
			$e = new EventEmitter(),
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10, {group: 'foo', label: 'foo'});

		$a.promise(Promise.resolve()).then(() => {
			i++;
		});

		$a.on($e, 'event', () => {
			i++;
		}, {label: 'foo'});

		$a.suspendAll({group: 'foo'});
		$e.emit('event');

		setTimeout(() => {
			expect(i).toBe(2);
			$a.unsuspendAll({group: 'foo', label: 'foo'});

			setTimeout(() => {
				expect(i).toBe(3);
				$a.clearAll();
				done();
			}, 5);
		}, 15);
	});
});
