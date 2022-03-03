/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Pull from 'core/pull';

describe('core/pull', () => {

	it('new simple usage', () => {
		let lastDestructed = null;
		const onClear = {clear: () => null};

		spyOn(onClear, 'clear');
		const pull = new Pull(Array, 2, [1, 2, 3], {
			onClear: onClear.clear,
			hashFn: (...args) => JSON.stringify(args),
			destructor: (value) => {
				lastDestructed = value;
			}
		});

		expect(pull.canTake(1, 2, 3)).toBe(2);

		expect(pull.canTake(1, 2)).toBe(0);

		const {
			destroy: destroy1,
			value: value1
		} = pull.take(1, 2, 3);
		expect(value1).toEqual([1, 2, 3]);

		destroy1(value1);

		expect(pull.canTake(1, 2, 3)).toBe(1);

		const {
			destroy: destroy2,
			value: value2
		} = pull.borrow(1, 2, 3);
		const {
			destroy: destroy3,
			value: value3
		} = pull.borrow(1, 2, 3);
		expect(value2).toEqual([1, 2, 3]);

		expect(value3).toEqual([1, 2, 3]);

		value2.push(4);
		expect(value3[3]).toEqual(value2[3]);

		lastDestructed = null;
		destroy3(value3);
		expect(lastDestructed).toBe(null);

		destroy2(value2);

		expect(lastDestructed).toEqual([1, 2, 3, 4]);

		expect(pull.canBorrow(1, 2, 3)).toBe(false);

		expect(pull.canBorrow(2, 3)).toBe(false);

		const {
			destroy: destroy4,
			value: value4
		} = pull.borrowOrCreate(2, 3);
		expect(value4)
			.toEqual([2, 3]);

		destroy4(value4);

		pull.takeOrCreate(2, 3);
		expect(pull.canTake(2, 3)).toBe(0);

		pull.clear();
		expect(pull.canTake(2, 3)).toBe(0);
		expect(lastDestructed).toEqual([2, 3]);
		expect(onClear.clear).toHaveBeenCalledTimes(1);
	});

	it('simple usage', () => {
		const test = (maxSize, onFree = true, onTake = true) => {
			let freeCount = 0;
			let lastValue;
			let fArgs;
			let takeCount = 0;
			const settings = {};
			if (maxSize) {
				settings.maxSize = maxSize;
			}

			if (onFree) {
				settings.onFree = (value, pull, args) => {
					freeCount++;
					lastValue = value;
					fArgs = args;
				};
			}

			if (onTake) {
				settings.onTake = (value, pull, args) => {
					takeCount++;
					lastValue = value;
					fArgs = args;
				};
			}

			const pull = new Pull(Object, 10, [], settings);

			expect(pull.canTake())
				.toBe(10);

			const {
				free: free1,
				value: value1
			} = pull.take('hi');
			const {
				free: free2,
				value: value2
			} = pull.take('yo');

			if (onTake) {
				expect(takeCount)
					.toBe(2);

				expect(lastValue)
					.toBe(value2);

				expect(fArgs[0])
					.toBe('yo');
			}

			expect(pull.canTake())
				.toBe(8);

			expect(value1)
				.toBeInstanceOf(Object);

			expect(value2)
				.toBeInstanceOf(Object);

			free1(value1, 'heh');

			if (onFree) {
				expect(freeCount)
					.toBe(1);

				expect(lastValue)
					.toBe(value1);

				expect(fArgs[0])
					.toBe('heh');
			}

			expect(pull.canTake())
				.toBe(9);

			for (let i = 0; i < 10; i++) {
				pull.takeOrCreate();
			}

			expect(pull.canTake())
				.toBe(0);

			free2(value2);
		};

		test();
		test(11);
		test(100, false);
		test(100, false, false);
		test(100, true, false);
	});

	it('borrow usage', () => {

		const pull = new Pull(Array, {
			hashFn: (...args) => JSON.stringify(args)
			// OnClear: (pull) => {}
		});

		expect(pull.canBorrow())
			.toBe(false);

		const {
			value,
			destroy
		} = pull.borrowOrCreate();

		expect(value)
			.toBeInstanceOf(Array);

		const {
			value: value1,
			destroy: destroy1
		} = pull.borrowOrCreate();

		expect(value1).toBeInstanceOf(Array);

		destroy(value);
		destroy1(value1);
		expect(pull.canBorrow()).toBe(false);

		const {
			free: free2,
			value: value2
		} = pull.takeOrCreate();
		free2(value2);

		let int = 0;
		pull.borrowOrWait()
			.then(({
							 value
						 }) => {
				int++;
				expect(value)
					.toBeInstanceOf(Array);
			});

		expect(int)
			.toBe(1);

	});

	it('advanced usage', () => {
		let counter = 0;
		const pull = new Pull(Object, 1, [], {maxSize: 10});
		pull.takeOrWait()
			.then(() => {
				counter = 1;

				expect(pull.canTake())
					.toBe(0);

			});

		expect(counter)
			.toBe(1);

		pull.takeOrWait()
			.then(({
							 free,
							 value: val
						 }) => {

				expect(counter)
					.toBe(2);

				expect(pull.canTake())
					.toBe(0);

				free(val);
			});

		counter = 2;
		const {
			free,
			value
		} = pull.takeOrCreate();
		free(value);
	});
});
