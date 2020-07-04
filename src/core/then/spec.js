/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';

describe('core/then', () => {
	it('simple then', async () => {
		let
			i = 1;

		const promise = new Then((resolve) => {
			resolve();
		})
			.then(() => i + 2)
			.then((val) => i = val * 2);

		expect(i).toBe(1);

		await promise;
		expect(i).toBe(6);
	});

	it('aborting of a promise', async () => {
		let
			status = 'pending';

		const promise = new Then((resolve, reject, onAbort) => {
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
				parentPromise = new Then(() => undefined),
				promise = new Then(() => undefined, parentPromise).catch((err) => err);

			parentPromise.abort('boom');
			expect(await promise)
				.toBe('boom');

			await parentPromise;

		} catch {}

		try {
			const
				parentPromise = new Then(() => undefined).catch((err) => err),
				promise = new Then(() => undefined, parentPromise);

			promise.abort('boom');
			expect(await parentPromise).toBe('boom');

			await promise;
		} catch {}
	});

	it('rejected then', async () => {
		let
			i = 1;

		await new Then((resolve, reject) => {
			reject('boom');
		})
			.then((val) => val * 2, (err) => {
				expect(err).toBe('boom');
				i += 2;
			});

		expect(i).toBe(3);
	});

	it('dynamically rejected catch', async () => {
		let
			i = 1;

		await new Then((resolve) => {
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

	it('catch', async () => {
		let
			i = 1;

		await new Then((resolve, reject) => {
			reject('boom');
		})
			.then((val) => val * 2)
			.catch((err) => {
				expect(err).toBe('boom');
				i += 2;
			});

		expect(i).toBe(3);
	});

	it('dynamically rejected catch', async () => {
		let
			i = 1;

		await new Then((resolve) => {
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

	it('resolved finally', async () => {
		let
			i = 1;

		await new Then((resolve) => {
			resolve();
		})
			.then(() => i + 2)
			.finally((arg) => {
				expect(arg).toBeUndefined();
				i *= 2;
			});

		expect(i).toBe(2);
	});

	it('rejected finally', async () => {
		let
			i = 1;

		try {
			await new Then((resolve, reject) => {
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

	it('dynamically rejected finally', async () => {
		let
			i = 1;

		await new Then((resolve) => {
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

	it('Then.resolve', async () => {
		let
			i = 0,
			j = 0;

		await Then.resolve(1)
			.then((val) => i = val + 2)
			.then((val) => i = val * 2);

		await Then.resolve(Then.resolve(1))
			.then((val) => j = val + 2)
			.then((val) => j = val * 2);

		expect(i).toBe(6);
		expect(j).toBe(6);
	});

	it('Then.reject', async () => {
		let
			i = 1;

		await Then.reject('boom')
			.catch((err) => {
				expect(err).toBe('boom');
				i += 2;
			});

		expect(i).toBe(3);
	});

	it('Then.all', async () => {
		let res;

		await Then.all([
			1,
			null,
			Then.resolve(2)
		]).then((val) => res = val);

		expect(res).toEqual([1, null, 2]);
	});

	it('Then.race', async () => {
		let res;

		await Then.race([
			Promise.resolve(1),
			Then.resolve(2)
		]).then((val) => res = val);

		expect(res).toBe(2);
	});
});
