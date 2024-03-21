/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { debounce } from './lazy';

describe('core/functools/lazy', () => {
	it('@debounce', (done) => {
		class Input {
			value: string = '';

			invocationsCount: number = 0;

			@debounce(50)
			changeValue(val: string) {
				this.invocationsCount++;
				this.value = val;
			}
		}

		const input1 = new Input();

		input1.changeValue('h');
		input1.changeValue('he');
		input1.changeValue('hell');
		input1.changeValue('hello world');

		setTimeout(() => {
			expect(input1.invocationsCount).toBe(1);
			expect(input1.value).toBe('hello world');
			done();
		}, 100);
	});

	it('@debounce for many instances', (done) => {
		class Input {
			value: string = '';

			invocationsCount: number = 0;

			@debounce(50)
			changeValue(val: string) {
				this.invocationsCount++;
				this.value = val;
			}
		}

		const input1 = new Input();
		const input2 = new Input();
		const input3 = new Input();

		input1.changeValue('h');
		input2.changeValue('h');
		input3.changeValue('h');

		input1.changeValue('he');
		input2.changeValue('he');
		input3.changeValue('he');

		input1.changeValue('hell');
		input2.changeValue('hell');
		input3.changeValue('hell');

		input1.changeValue('hello world');
		input2.changeValue('hello world');
		input3.changeValue('hello world');

		setTimeout(() => {
			expect(input1.invocationsCount).toBe(1);
			expect(input2.invocationsCount).toBe(1);
			expect(input3.invocationsCount).toBe(1);

			expect(input1.value).toBe('hello world');
			expect(input2.value).toBe('hello world');
			expect(input3.value).toBe('hello world');
			done();
		}, 500);
	});
});
