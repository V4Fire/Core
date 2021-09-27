/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SyncPromise from 'core/promise/sync';

describe('core/prelude/structures/sync-promise', () => {
	it('simple `then`', () => {
		let
			i = 1;

		new SyncPromise((resolve) => {
			resolve();
		})
			.then(() => i + 2)
			.then((val) => i = val * 2);

		expect(i).toBe(6);
	});

	it('promise that is resolved with another promise', async () => {
		const i = await new SyncPromise((resolve) => {
			resolve(
				new Promise((r) => setTimeout(() => r(SyncPromise.resolve(1)), 50))
			);
		})
			.then((val) => new Promise((r) => setTimeout(() => r(SyncPromise.resolve(val + 2)), 50)))
			.then((val) => val * 2);

		expect(i).toBe(6);
	});

	it('promise that is rejected with another promise', async () => {
		let i;

		try {
			await new SyncPromise((resolve) => {
				resolve(
					new Promise((r) => setTimeout(() => r(SyncPromise.resolve(1)), 50))
				);
			})
				.then((val) => new Promise((r) => setTimeout(() => r(SyncPromise.reject(val + 2)), 50)))
				.catch((val) => Promise.reject(val * 2));

		} catch (err) {
			i = err;
		}

		expect(i).toBe(6);
	});

	it('promise that is rejected with another promise by using a constructor', async () => {
		let i;

		try {
			await new SyncPromise((resolve, reject) => {
				reject(SyncPromise.resolve(1));
			});

		} catch (err) {
			i = err;
		}

		expect(i).toBeInstanceOf(SyncPromise);
		expect(await i).toBe(1);
	});

	it('resolved `then` after `catch`', () => {
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

	it('rejected `then`', () => {
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

	it('dynamically rejected `catch`', () => {
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

	it('`catch`', () => {
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

	it('dynamically rejected `catch`', () => {
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

	it('resolved `finally`', () => {
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

	it('rejected `finally`', async () => {
		try {
			let
				i = 1;

			const promise = new SyncPromise((resolve, reject) => {
				reject('boom');
			})
				.finally((arg) => {
					expect(arg).toBeUndefined();
					i *= 2;
				});

			expect(i).toBe(2);
			await promise;

		} catch (err) {
			expect(err).toBe('boom');
		}
	});

	it('dynamically rejected `finally`', () => {
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

	it('`finally` that returns an error', () => {
		let
			reason;

		new SyncPromise((resolve) => {
			resolve(1);
		})
			.finally(() => SyncPromise.reject('Boom'))

			.catch((err) => {
				reason = err;
			});

		expect(reason).toBe('Boom');
	});

	it('`finally` that throws an error', () => {
		let
			reason;

		new SyncPromise((resolve) => {
			resolve(1);
		})
			.finally(() => {
				throw 'Boom';
			})

			.catch((err) => {
				reason = err;
			});

		expect(reason).toBe('Boom');
	});

	it('`SyncPromise.resolve`', () => {
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

	it('`SyncPromise.reject`', () => {
		let
			i = 1;

		SyncPromise.reject('boom')
			.catch((err) => {
				expect(err).toBe('boom');
				i += 2;
			});

		expect(i).toBe(3);
	});

	describe('`SyncPromise.all`', () => {
		it('all promises are resolved', () => {
			let
				res;

			SyncPromise.all([1, null, SyncPromise.resolve(2)])
				.then((val) => res = val);

			expect(res).toEqual([1, null, 2]);
		});

		it('some promises are rejected', () => {
			let
				res;

			SyncPromise.all([1, null, SyncPromise.reject(2)]).then(
				(val) => res = val,
				(err) => res = err
			);

			expect(res).toBe(2);
		});
	});

	it('`SyncPromise.allSettled`', () => {
		let
			res;

		SyncPromise.allSettled([1, null, SyncPromise.reject(2)]).then(
			(val) => res = val,
			(err) => res = err
		);

		expect(res).toEqual([
			{status: 'fulfilled', value: 1},
			{status: 'fulfilled', value: null},
			{status: 'rejected', reason: 2}
		]);
	});

	describe('`SyncPromise.race`', () => {
		it('all promises are resolved', () => {
			let
				res;

			SyncPromise.race([Promise.resolve(1), SyncPromise.resolve(2)])
				.then((val) => res = val);

			expect(res).toBe(2);
		});

		it('some promises are rejected', () => {
			let
				res;

			SyncPromise.race([Promise.resolve(1), SyncPromise.reject(2)]).then(
				(val) => res = val,
				(err) => res = ['error', err]
			);

			expect(res).toEqual(['error', 2]);
		});
	});
});
