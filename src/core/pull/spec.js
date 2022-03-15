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

		free(value);

		expect(pull.canTake()).toBe(1);
		expect(pull.canBorrow()).toBe(true);

		const {value: value2, free: free2} = pull.take();

		expect(value2).toBe(arr);
		expect(pull.canTake()).toBe(0);
		expect(pull.canBorrow()).toBe(false);

		const promise = pull.takeOrWait();

		free2(value);

		const {value: value3, free: free3} = await promise;

		expect(value3).toBe(arr);
		expect(pull.canTake()).toBe(0);
		expect(pull.canBorrow()).toBe(false);

		free3(value3);

		expect(pull.canTake()).toBe(1);
		expect(pull.canBorrow()).toBe(true);
	});

	it('borrow usage', async () => {
		const pull = new Pull(Array);

		const {value, free} = pull.borrowOrCreate();

		expect(value).toBeInstanceOf(Array);
		expect(pull.canBorrow()).toBe(true);

		const {value: value1, destroy} = pull.borrow();

		expect(value1).toBe(value);
		expect(pull.canBorrow()).toBe(true);

		free(value);

		expect(pull.canTake()).toBe(0);

		destroy(value1);

		expect(pull.canBorrow()).toBe(false);

		const {value: value2, free: free2} = pull.takeOrCreate();

		const promise = pull.borrowOrWait();

		free2(value2);

		const {value: value3} = await promise;

		expect(value3).toBeInstanceOf(Array);
	});

	it('hash function and onTake, onFree', () => {
		let lastTaken = null;
		let lastFreed = null;

		const pull = new Pull(Array, 1, [1, 2], {
				hashFn: (...args) => JSON.stringify(args),
				onTake: (value, pull, ...args) => {
					lastTaken = [value, args];
				},
				onFree: (value, pull, ...args) => {
					lastFreed = [value, args];
				}
		});

		expect(pull.canTake()).toBe(0);
		expect(pull.canTake(1, 2)).toBe(1);

		const {value, free} = pull.take(1, 2);

		expect(value).toEqual([1, 2]);
		expect(lastTaken).toEqual([[1, 2], [1, 2]]);

		value.push(3);

		free(value, 'a', 'r');
		expect(lastFreed).toEqual([[1, 2, 3], ['a', 'r']]);

		const {value: value1, free: free1} = pull.takeOrCreate(1, 2);

		expect(value1).toEqual([1, 2, 3]);
		expect(lastTaken).toEqual([[1, 2, 3], [1, 2]]);

		free1(value1, 'g', 's');
		expect(lastFreed).toEqual([[1, 2, 3], ['g', 's']]);

		const {value: value2, free: free2} = pull.takeOrCreate(1, 2, 4);

		expect(value2).toEqual([1, 2, 4]);
		expect(lastTaken).toEqual([[1, 2, 4], [1, 2, 4]]);

		free2(value2, 'lol');
		expect(lastFreed).toEqual([[1, 2, 4], ['lol']]);
	});

	it('clear pull', () => {
		let lastDestructed = null;
		let clearArgs = null;

		const pull = new Pull(
			(...args) => [1, 2, ...args],
			2,
			[3, 4],
			{
				destructor: (el) => {
					lastDestructed = el;
				},
				onClear: (pull, ...args) => {
					clearArgs = args;
				}
			}
		);

		const {value, destroy} = pull.take();

		expect(value).toEqual([1, 2, 3, 4]);

		destroy(value);

		expect(pull.canTake()).toBe(1);
		expect(lastDestructed).toEqual([1, 2, 3, 4]);

		pull.clear('clear', 'args');

		expect(pull.canTake()).toBe(0);
		expect(clearArgs).toEqual(['clear', 'args']);
	});
});
