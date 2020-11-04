/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SyncPromise from 'core/promise/sync';

describe('core/prelude/structures/sync-promise', () => {
	it('simple then', () => {
		let
			i = 1;

		new SyncPromise((resolve) => {
			resolve();
		})
			.then(() => i + 2)
			.then((val) => i = val * 2);

		expect(i).toBe(6);
	});

	it('resolved then after catch', () => {
		let
			i = 1;

		new SyncPromise((resolve) => {
			resolve();
		})
			.catch(() => undefined)
			.then(() => i + 2)
			.then((val) => i = val * 2);

		expect(i).toBe(6);
	});

	it('rejected then', () => {
		let
			i = 1;

		new SyncPromise((resolve, reject) => {
			reject('boom');
		})
			.then((val) => val * 2, (err) => {
				expect(err).toBe('boom');
				i += 2;
			});

		expect(i).toBe(3);
	});

	it('dynamically rejected catch', () => {
		let
			i = 1;

		new SyncPromise((resolve) => {
			resolve();
		})
			.then(() => {
				throw 'boom';
			})

			.then((val) => val * 2)
			.catch((err) => {
				expect(err).toBe('boom');
				return i += 2;
			})

			.then((val) => i = val * 2);

		expect(i).toBe(6);
	});

	it('catch', () => {
		let
			i = 1;

		new SyncPromise((resolve, reject) => {
			reject('boom');
		})
			.then((val) => val * 2)
			.catch((err) => {
				expect(err).toBe('boom');
				i += 2;
			});

		expect(i).toBe(3);
	});

	it('dynamically rejected catch', () => {
		let
			i = 1;

		new SyncPromise((resolve) => {
			resolve();
		})
			.then(() => {
				throw 'boom';
			})

			.then((val) => val * 2)
			.catch((err) => {
				expect(err).toBe('boom');
				return i += 2;
			})

			.then((val) => i = val * 2);

		expect(i).toBe(6);
	});

	it('resolved finally', () => {
		let
			i = 1;

		new SyncPromise((resolve) => {
			resolve();
		})
			.then(() => i + 2)
			.finally((arg) => {
				expect(arg).toBeUndefined();
				i *= 2;
			});

		expect(i).toBe(2);
	});

	it('rejected finally', () => {
		let
			i = 1;

		new SyncPromise((resolve, reject) => {
			reject('boom');
		})
			.finally((arg) => {
				expect(arg).toBeUndefined();
				i *= 2;
			});

		expect(i).toBe(2);
	});

	it('dynamically rejected finally', () => {
		let
			i = 1;

		new SyncPromise((resolve) => {
			resolve();
		})
			.then(() => {
				throw 'boom';
			})

			.then((val) => val * 2)

			.catch((err) => {
				expect(err).toBe('boom');
				return i + 2;
			})

			.finally((arg) => {
				expect(arg).toBeUndefined();
				return i *= 2;
			})

			.then((val) => {
				expect(val).toBe(3);
				return i = val * 2;
			});

		expect(i).toBe(6);
	});

	it('SyncPromise.resolve', () => {
		let
			i = 0,
			j = 0;

		SyncPromise.resolve(1)
			.then((val) => i = val + 2)
			.then((val) => i = val * 2);

		SyncPromise.resolve(SyncPromise.resolve(1))
			.then((val) => j = val + 2)
			.then((val) => j = val * 2);

		expect(i).toBe(6);
		expect(j).toBe(6);
	});

	it('SyncPromise.reject', () => {
		let
			i = 1;

		SyncPromise.reject('boom')
			.catch((err) => {
				expect(err).toBe('boom');
				i += 2;
			});

		expect(i).toBe(3);
	});

	it('SyncPromise.all', () => {
		let res;

		SyncPromise.all([
			1,
			null,
			SyncPromise.resolve(2)
		]).then((val) => res = val);

		expect(res).toEqual([1, null, 2]);
	});

	it('SyncPromise.race', () => {
		let res;

		SyncPromise.race([
			Promise.resolve(1),
			SyncPromise.resolve(2)
		]).then((val) => res = val);

		expect(res).toBe(2);
	});
});
