/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Pool from 'core/pool';

describe('core/pool', () => {
	it('simple usage', async () => {
		const pool = new Pool(Array);
		const {value, free} = pool.takeOrCreate();

		const arr = value;
		expect(value).toBeInstanceOf(Array);

		free();

		expect(pool.canTake()).toBe(1);
		expect(pool.canBorrow()).toBe(true);

		const {value: value2, free: free2} = pool.take();

		expect(value2).toBe(arr);
		expect(pool.canTake()).toBe(0);
		expect(pool.canBorrow()).toBe(false);

		const promise = pool.takeOrWait();

		free2();

		const {value: value3, free: free3} = await promise;

		expect(value3).toBe(arr);
		expect(pool.canTake()).toBe(0);
		expect(pool.canBorrow()).toBe(false);

		free3();

		expect(pool.canTake()).toBe(1);
		expect(pool.canBorrow()).toBe(true);
	});

	it('borrow usage', async () => {
		spyOn(console, 'log').and.callThrough();
		const pool = new Pool(Array);

		const {value, free} = pool.borrowOrCreate();

		expect(value).toBeInstanceOf(Array);
		expect(pool.canBorrow()).toBe(true);

		const {value: value1, destroy} = pool.borrow();

		expect(value1).toBe(value);
		expect(pool.canBorrow()).toBe(true);

		free();

		expect(pool.canTake()).toBe(0);

		destroy();

		expect(pool.canBorrow()).toBe(false);

		const {free: free2} = pool.takeOrCreate();

		const promise = pool.borrowOrWait();

		free2();

		const {value: value3} = await promise;

		expect(value3).toBeInstanceOf(Array);
	});

	it('take or borrow from an empty pool', () => {
		const pool = new Pool(Array);

		expect(pool.canTake()).toBe(0);

		const {value, free} = pool.take();

		expect(value).toBe(null);
		expect(() => free(value)).toThrowError();

		expect(pool.canBorrow()).toBe(false);

		const {value: value1, free: free1} = pool.borrow();

		expect(value1).toBe(null);
		expect(free1).toThrowError();
	});

	describe('constructors', () => {
		it('only objectFactory', () => {
			const pool = new Pool(Array);

			const {value} = pool.takeOrCreate();
			expect(value).toBeInstanceOf(Array);
		});

		it('objectFactory with size', () => {
			const pool = new Pool(Array, 2);

			expect(pool.canTake()).toBe(2);

			const {value} = pool.take();
			expect(value).toBeInstanceOf(Array);
		});

		it('objectFactory with size and createOpts', () => {
			const pool = new Pool(Array, 2, [1, 2]);

			expect(pool.canTake()).toBe(2);

			const {value} = pool.take();
			expect(value).toEqual([1, 2]);
		});
	});

	describe('hooks', () => {
		it('onTake', () => {
			let lastTaken = null;

			const pool = new Pool(Array, 1, [1, 2], {
				onTake: (value, pool, ...args) => {
					lastTaken = [value, args];
				}
			});

			 const {value} = pool.take('hi');

			expect(lastTaken).toEqual([value, ['hi']]);
		});

		it('onFree', () => {
			let lastFreed = null;

			const pool = new Pool(Array, 1, [1, 2], {
				onFree: (value, pool, ...args) => {
					lastFreed = [value, args];
				}
			});

			const {value, free} = pool.take('hi');

			free('hello');

			expect(lastFreed).toEqual([value, ['hello']]);
		});

		it('hashFn', () => {
			const pool = new Pool(Array, 1, [1, 2], {
				hashFn: (...args) => JSON.stringify(args)
			});

			expect(pool.canTake()).toBe(0);
			expect(pool.canTake(1, 2)).toBe(1);

			const {value, free} = pool.take(1, 2);

			expect(value).toEqual([1, 2]);

			value.push(3);

			free();

			const {value: value1, free: free1} = pool.takeOrCreate(1, 2);

			expect(value1).toEqual([1, 2, 3]);

			free1();

			const {value: value2} = pool.takeOrCreate(1, 2, 4);

			expect(value2).toEqual([1, 2, 4]);
		});

		it('onClear', () => {
			spyOn(console, 'log').and.callThrough();
			let clearArgs = null;

			const pool = new Pool(
				(...args) => [1, 2, ...args],
				2,
				[3, 4],
				{
					onClear: (pool, ...args) => {
						clearArgs = args;
					}
				}
			);

			pool.clear('clear', 'args');

			expect(pool.canTake()).toBe(0);
			expect(clearArgs).toEqual(['clear', 'args']);
		});

		it('destructor', () => {
			let lastDestructed = null;

			const pool = new Pool(
				() => [1, 2],
				2,
				{
					destructor: (el) => {
						lastDestructed = el;
					}
				}
			);

			const {value, destroy} = pool.take();

			expect(value).toEqual([1, 2]);

			value.push(3);

			destroy();

			expect(pool.canTake()).toBe(1);
			expect(lastDestructed).toEqual([1, 2, 3]);

			pool.clear('clear', 'args');

			expect(lastDestructed).toEqual([1, 2]);
		});
	});
});
