/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { debounce } from './lazy';

describe('core/functools', () => {
	it('@debounce', (done) => {
		class Input {

			invocationsCount: number = 0;

			@debounce(10)
			changeValue() {
				this.invocationsCount++;
			}
		}

		const input1 = new Input();

		input1.changeValue();
		input1.changeValue();
		input1.changeValue();
		input1.changeValue();
		input1.changeValue();

		setTimeout(() => {
			expect(input1.invocationsCount).toBe(1);
			done();
		}, 20);
	});

	it('@debounce for many instances', (done) => {
		class Input {

			invocationsCount: number = 0;

			@debounce(10)
			changeValue() {
				this.invocationsCount++;
			}
		}

		const input1 = new Input();
		const input2 = new Input();

		input1.changeValue();
		input2.changeValue();

		input1.changeValue();
		input2.changeValue();

		setTimeout(() => {
			expect(input1.invocationsCount).toBe(1);
			expect(input2.invocationsCount).toBe(1);

			done();
		}, 20);
	});
});
