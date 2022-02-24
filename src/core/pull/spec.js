/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Pull from 'core/pull';

describe('core/pull', () => {
	it('simple usage', () => {
		const test = (maxSize, onFree = true, onTake = true) => {
			let freeCount = 0;
			let lastValue;
			let fArgs;
			let takeCount = 0;
			const settings = {};
			if(maxSize) {
			 settings.maxSize = maxSize;
			}

			if(onFree) {
					settings.onFree = (value, pull, args) => {
					freeCount++;
					lastValue = value;
					fArgs = args;
				};
}

			if(onTake) {
				settings.onTake = (value, pull, args) => {
					takeCount++;
					lastValue = value;
					fArgs = args;
				};
			}

			const pull = new Pull(Object, 10, settings);

			expect(pull.available).toBe(10);
			expect(pull.size).toBe(10);

			const {free: free1, value: value1} = pull.take('hi');
			const {free: free2, value: value2} = pull.take('yo');

			if(onTake) {
				expect(takeCount).toBe(2);
				expect(lastValue).toBe(value2);
				expect(fArgs[0]).toBe('yo');
			}

			expect(pull.available).toBe(8);
			expect(value1).toBeInstanceOf(Object);
			expect(value2).toBeInstanceOf(Object);

			free1(value1, 'heh');

			if(onFree) {
				expect(freeCount).toBe(1);
				expect(lastValue).toBe(value1);
				expect(fArgs[0]).toBe('heh');
			}

			expect(pull.available).toBe(9);

		  for(let i = 0; i < 10; i++) {
			 pull.takeOrCreate();
			}

			expect(pull.available).toBe(0);
			expect(pull.size).toBe(11);
			free2(value2);
		};

		test();
		test(11);
		test(100, false);
		test(100, false, false);
		test(100, true, false);
		expect(() => test(10)).toThrow(new Error('Pull is empty'));
	});

	it('advanced usage', () => {
		let counter = 0;
		const pull = new Pull(Object, 1, {maxSize: 10});
		pull.takeOrWait().then(() => {
			counter = 1;

			expect(pull.available).toBe(0);

		});

		expect(counter).toBe(1);

		pull.takeOrWait().then(({free, value: val}) => {

			expect(counter).toBe(2);
			expect(pull.available).toBe(0);
			free(val);
		});

		counter = 2;
		const {free, value} = pull.takeOrCreate();
		free(value);
	});
});
