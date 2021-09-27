/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import AbortablePromise from 'core/promise/abortable';

describe('core/promise/abortable', () => {
	it('simple `then`', async () => {
		let
			i = 1;

		const promise = new AbortablePromise((resolve) => {
			resolve();
		})
			.then(() => i + 2)
			.then((val) => i = val * 2);

		expect(i).toBe(1);

		await promise;
		expect(i).toBe(6);
	});

	it('promise that is resolved with another promise', async () => {
		const i = await new AbortablePromise((resolve) => {
			resolve(
				new Promise((r) => setTimeout(() => r(AbortablePromise.resolve(1)), 50))
			);
		})
			.then((val) => new Promise((r) => setTimeout(() => r(AbortablePromise.resolve(val + 2)), 50)))
			.then((val) => val * 2);

		expect(i).toBe(6);
	});

	it('promise that is rejected with another promise', async () => {
		let i;

		try {
			await new AbortablePromise((resolve) => {
				resolve(
					new Promise((r) => setTimeout(() => r(AbortablePromise.resolve(1)), 50))
				);
			})
				.then((val) => new Promise((r) => setTimeout(() => r(AbortablePromise.reject(val + 2)), 50)))
				.catch((val) => Promise.reject(val * 2));

		} catch (err) {
			i = err;
		}

		expect(i).toBe(6);
	});

	it('promise that is rejected with another promise by using a constructor', async () => {
		let i;

		try {
			await new AbortablePromise((resolve, reject) => {
				reject(AbortablePromise.resolve(1));
			});

		} catch (err) {
			i = err;
		}

		expect(i).toBeInstanceOf(AbortablePromise);
		expect(await i).toBe(1);
	});

	it('aborting of a promise', async () => {
		let
			status = 'pending';

		const promise = new AbortablePromise((resolve, reject, onAbort) => {
			onAbort(() => {
				status = 'aborted';
			});

			setTimeout(resolve, 10);
		})
			.then(() => status = 'resolved');

		promise.abort('boom');

		try {
			await promise;

		} catch (err) {
			expect(err).toBe('boom');
		}

		expect(status).toBe('aborted');
	});

	it('providing of a parent promise', async () => {
		try {
			const
				parentPromise = new AbortablePromise(() => undefined),
				promise = new AbortablePromise(() => undefined, parentPromise).catch((err) => err);

			parentPromise.abort('boom');
			expect(await promise)
				.toBe('boom');

			await parentPromise;

		} catch {}

		try {
			const
				parentPromise = new AbortablePromise(() => undefined).catch((err) => err),
				promise = new AbortablePromise(() => undefined, parentPromise);

			promise.abort('boom');
			expect(await parentPromise).toBe('boom');

			await promise;
		} catch {}
	});

	it('rejected `then`', async () => {
		let
			i = 1;

		await new AbortablePromise((resolve, reject) => {
			reject('boom');
		})
			.then((val) => val * 2, (err) => {
				expect(err).toBe('boom');
				i += 2;
			});

		expect(i).toBe(3);
	});

	it('dynamically rejected `catch`', async () => {
		let
			i = 1;

		await new AbortablePromise((resolve) => {
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

	it('`catch`', async () => {
		let
			i = 1;

		await new AbortablePromise((resolve, reject) => {
			reject('boom');
		})
			.then((val) => val * 2)
			.catch((err) => {
				expect(err).toBe('boom');
				i += 2;
			});

		expect(i).toBe(3);
	});

	it('dynamically rejected `catch`', async () => {
		let
			i = 1;

		await new AbortablePromise((resolve) => {
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

	it('resolved `finally`', async () => {
		let
			i = 1;

		await new AbortablePromise((resolve) => {
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
		let
			i = 1;

		try {
			await new AbortablePromise((resolve, reject) => {
				reject('boom');
			})
				.finally((arg) => {
					expect(arg).toBeUndefined();
					i *= 2;
				});

		} catch (err) {
			expect(err).toBe('boom');
		}

		expect(i).toBe(2);
	});

	it('dynamically rejected `finally`', async () => {
		let
			i = 1;

		await new AbortablePromise((resolve) => {
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

	it('`finally` that returns an error', async () => {
		const reason = await new AbortablePromise((resolve) => {
			resolve(1);
		})
			.finally(() => AbortablePromise.reject('Boom'))
			.catch((err) => err);

		expect(reason).toBe('Boom');
	});

	it('`finally` that throws an error', async () => {
		const reason = await new AbortablePromise((resolve) => {
			resolve(1);
		})
			.finally(() => {
				throw 'Boom';
			})

			.catch((err) => err);

		expect(reason).toBe('Boom');
	});

	it('`AbortablePromise.resolve`', async () => {
		let
			i = 0,
			j = 0;

		await AbortablePromise.resolve(1)
			.then((val) => i = val + 2)
			.then((val) => i = val * 2);

		await AbortablePromise.resolve(AbortablePromise.resolve(1))
			.then((val) => j = val + 2)
			.then((val) => j = val * 2);

		expect(i).toBe(6);
		expect(j).toBe(6);
	});

	it('`AbortablePromise.reject`', async () => {
		let
			i = 1;

		await AbortablePromise.reject('boom')
			.catch((err) => {
				expect(err).toBe('boom');
				i += 2;
			});

		expect(i).toBe(3);
	});

	describe('`AbortablePromise.all`', () => {
		it('all promises are resolved', async () => {
			const res = await AbortablePromise.all([
				1,
				null,
				AbortablePromise.resolve(2)
			]);

			expect(res).toEqual([1, null, 2]);
		});

		it('some promises are rejected', async () => {
			let
				res;

			try {
				res = await AbortablePromise.all([
					1,
					null,
					AbortablePromise.reject(2)
				]);

			} catch (err) {
				res = err;
			}

			expect(res).toBe(2);
		});
	});

	it('`AbortablePromise.race`', async () => {
		let res;

		await AbortablePromise.race([
			Promise.resolve(1),
			AbortablePromise.resolve(2)
		]).then((val) => res = val);

		expect(res).toBe(2);
	});

	describe('`AbortablePromise.race`', () => {
		it('all promises are resolved', async () => {
			const res = await AbortablePromise.race([
				Promise.resolve(1),
				AbortablePromise.resolve(2)
			]);

			expect(res).toBe(2);
		});

		it('some promises are rejected', async () => {
			let
				res;

			try {
				res = await AbortablePromise.race([
					new Promise((r) => setTimeout(r, 15)),
					AbortablePromise.reject(2)
				]);

			} catch (err) {
				res = err;
			}

			expect(res).toBe(2);
		});
	});
});
