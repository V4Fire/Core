/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Pull from 'core/pull';

describe('core/pull', () => {
	it('simple usage', async () => {
		const pull = new Pull(Array);
		const {value, free} = pull.takeOrCreate();

		const arr = value;
		expect(value).toBeInstanceOf(Array);

		free();

		expect(pull.canTake()).toBe(1);
		expect(pull.canBorrow()).toBe(true);

		const {value: value2, free: free2} = pull.take();

		expect(value2).toBe(arr);
		expect(pull.canTake()).toBe(0);
		expect(pull.canBorrow()).toBe(false);

		const promise = pull.takeOrWait();

		free2();

		const {value: value3, free: free3} = await promise;

		expect(value3).toBe(arr);
		expect(pull.canTake()).toBe(0);
		expect(pull.canBorrow()).toBe(false);

		free3();

		expect(pull.canTake()).toBe(1);
		expect(pull.canBorrow()).toBe(true);
	});

	it('borrow usage', async () => {
		spyOn(console, 'log').and.callThrough();
		const pull = new Pull(Array);

		const {value, free} = pull.borrowOrCreate();

		expect(value).toBeInstanceOf(Array);
		expect(pull.canBorrow()).toBe(true);

		const {value: value1, destroy} = pull.borrow();

		expect(value1).toBe(value);
		expect(pull.canBorrow()).toBe(true);

		free();

		expect(pull.canTake()).toBe(0);

		destroy();

		expect(pull.canBorrow()).toBe(false);

		const {free: free2} = pull.takeOrCreate();

		const promise = pull.borrowOrWait();

		free2();

		const {value: value3} = await promise;

		expect(value3).toBeInstanceOf(Array);
	});

	it('take or borrow from empty queue', () => {
		const pull = new Pull(Array);

		expect(pull.canTake()).toBe(0);

		const {value, free} = pull.take();

		expect(value).toBe(null);
		expect(() => free(value)).toThrowError();

		expect(pull.canBorrow()).toBe(false);

		const {value: value1, free: free1} = pull.borrow();

		expect(value1).toBe(null);
		expect(free1).toThrowError();
	});

	describe('constructors', () => {
		it('onle objectFactory', () => {
			const pull = new Pull(Array);

			const {value} = pull.takeOrCreate();
			expect(value).toBeInstanceOf(Array);
		});

		it('objectFactory with size', () => {
			const pull = new Pull(Array, 2);

			expect(pull.canTake()).toBe(2);

			const {value} = pull.take();
			expect(value).toBeInstanceOf(Array);
		});

		it('objectFactory with size and createOpts', () => {
			const pull = new Pull(Array, 2, [1, 2]);

			expect(pull.canTake()).toBe(2);

			const {value} = pull.take();
			expect(value).toEqual([1, 2]);
		});
	});

	describe('hooks', () => {
		it('onTake', () => {
			let lastTaken = null;

			const pull = new Pull(Array, 1, [1, 2], {
				onTake: (value, pull, ...args) => {
					lastTaken = [value, args];
				}
			});

			 const {value} = pull.take('hi');

			expect(lastTaken).toEqual([value, ['hi']]);
		});

		it('onFree', () => {
			let lastFreed = null;

			const pull = new Pull(Array, 1, [1, 2], {
				onFree: (value, pull, ...args) => {
					lastFreed = [value, args];
				}
			});

			const {value, free} = pull.take('hi');

			free('hello');

			expect(lastFreed).toEqual([value, ['hello']]);
		});

		it('hashFn', () => {
			const pull = new Pull(Array, 1, [1, 2], {
				hashFn: (...args) => JSON.stringify(args)
			});

			expect(pull.canTake()).toBe(0);
			expect(pull.canTake(1, 2)).toBe(1);

			const {value, free} = pull.take(1, 2);

			expect(value).toEqual([1, 2]);

			value.push(3);

			free();

			const {value: value1, free: free1} = pull.takeOrCreate(1, 2);

			expect(value1).toEqual([1, 2, 3]);

			free1();

			const {value: value2} = pull.takeOrCreate(1, 2, 4);

			expect(value2).toEqual([1, 2, 4]);
		});

		// It('onClear', () => {
		// let clearArgs = null;
		//
		// const pull = new Pull(
		// (...args) => [1, 2, ...args],
		// 2,
		// [3, 4],
		// {
		// onClear: (pull, ...args) => {
		// clearArgs = args;
		// }
		// }
		// );
		//
		// pull.clear('clear', 'args');
		//
		// expect(pull.canTake()).toBe(0);
		// expect(clearArgs).toEqual(['clear', 'args']);
		// });

		it('destructor', () => {
			let lastDestructed = null;

			const pull = new Pull(
				() => [1, 2],
				2,
				{
					destructor: (el) => {
						lastDestructed = el;
					}
				}
			);

			const {value, destroy} = pull.take();

			expect(value).toEqual([1, 2]);

			value.push(3);

			destroy();

			expect(pull.canTake()).toBe(1);
			expect(lastDestructed).toEqual([1, 2, 3]);

			pull.clear('clear', 'args');

			expect(lastDestructed).toEqual([1, 2]);
		});
	});
});
