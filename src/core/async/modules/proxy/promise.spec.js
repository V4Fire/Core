/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';

describe('core/async/modules/proxy `promise`', () => {
	let $a;

	beforeEach(() => {
		$a = new Async();
	});

	it('simple promise wrapper with the resolved promise', async () => {
		expect(await $a.promise(Promise.resolve('All fine'))).toBe('All fine');
	});

	it('chained promise wrapper with the resolved promise', async () => {
		expect(await $a.promise(Promise.resolve('All fine')).catch(() => 'Boom!')).toBe('All fine');
	});

	it('simple promise wrapper with the rejected promise', async () => {
		try {
			await $a.promise(Promise.reject('Boom!'));
			throw 'Oops';

		} catch (err) {
			expect(err).toBe('Boom!');
		}
	});

	it('chained promise wrapper with the rejected promise', async () => {
		const res = $a.promise(Promise.reject('Boom!')).catch((err) => {
			expect(err).toBe('Boom!');
			return 'All fine';
		});

		expect(await res).toBe('All fine');
	});

	it('cancel promise by label', async () => {
		let i = 0;
		const label = 'label';

		$a.promise(new Promise((resolve) => setTimeout(resolve, 100)), {label})
			.then(() => {
				i++;
			})
			.catch(() => undefined);

		$a.cancelPromise({label});
		await $a.sleep(200);

		expect(i).toEqual(0);
	});

	it('cancel promise by id', async () => {
		let i = 0;

		const prom = new Promise((resolve) => setTimeout(resolve, 100));

		const res = $a.promise(prom);

		res.then(() => {
			i++;
		}).catch(() => undefined);

		$a.cancelPromise(res);

		await $a.sleep(150);

		expect(i).toEqual(0);
	});

	describe('suspendPromise/unsuspendPromise`', () => {
		it('suspending a promise by id', async () => {
			let i = 0;

			const promise = $a.promise(
				new Promise((resolve) => setTimeout(resolve, 150))
			);

			promise.then(() => {
				i++;
			});

			expect(i).toEqual(0);

			$a.suspendPromise(promise);
			await $a.sleep(200);
			expect(i).toEqual(0);

			$a.unsuspendPromise(promise);
			expect(i).toEqual(1);
		});

		it('suspending a promise by a label', async () => {
			let i = 0;

			const
				label = {label: 'foo'};

			const promise = $a.promise(
				new Promise((resolve) => setTimeout(resolve, 150)),
				label
			);

			promise.then(() => {
				i++;
			});

			expect(i).toEqual(0);

			$a.suspendPromise(label);
			await $a.sleep(200);
			expect(i).toEqual(0);

			$a.unsuspendPromise(label);
			expect(i).toEqual(1);
		});

		it('suspending a promise by a group', async () => {
			let i = 0;

			const
				group = {group: 'foo'};

			const promise = $a.promise(
				new Promise((resolve) => setTimeout(resolve, 150)),
				group
			);

			promise.then(() => {
				i++;
			});

			expect(i).toEqual(0);

			$a.suspendPromise(group);
			await $a.sleep(200);
			expect(i).toEqual(0);

			$a.unsuspendPromise(group);
			expect(i).toEqual(1);
		});
	});

	describe('mutePromise/unmutePromise`', () => {
		it('muting a promise by id', async () => {
			let i = 0;

			const promise = $a.promise(
				new Promise((resolve) => setTimeout(resolve, 150))
			);

			promise.then(
				() => {
					i++;
				},

				() => {
					// Loopback
				}
			);

			expect(i).toEqual(0);

			$a.mutePromise(promise);
			await $a.sleep(200);
			expect(i).toEqual(0);

			$a.unmutePromise(promise);
			expect(i).toEqual(0);

			await expect(promise).rejects.toBeTruthy();
		});

		it('muting a promise by a label', async () => {
			let i = 0;

			const
				label = {label: 'foo'};

			const promise = $a.promise(
				new Promise((resolve) => setTimeout(resolve, 150)),
				label
			);

			promise.then(
				() => {
					i++;
				},

				() => {
					// Loopback
				}
			);

			expect(i).toEqual(0);

			$a.mutePromise(label);
			await $a.sleep(200);
			expect(i).toEqual(0);

			$a.unmutePromise(label);
			expect(i).toEqual(0);

			await expect(promise).rejects.toBeTruthy();
		});

		it('muting a promise by a group', async () => {
			let i = 0;

			const
				group = {group: 'foo'};

			const promise = $a.promise(
				new Promise((resolve) => setTimeout(resolve, 150)),
				group
			);

			promise.then(
				() => {
					i++;
				},

				() => {
					// Loopback
				}
			);

			expect(i).toEqual(0);

			$a.mutePromise(group);
			await $a.sleep(200);
			expect(i).toEqual(0);

			$a.unmutePromise(group);
			expect(i).toEqual(0);

			await expect(promise).rejects.toBeTruthy();
		});
	});
});
