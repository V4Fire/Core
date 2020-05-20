/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import watch from 'core/object/watch';

describe('core/object/watch', () => {
	it('watching for an array', () => {
		const
			arr = [],
			spy = jasmine.createSpy();

		const {proxy} = watch(arr, {immediate: true}, (value, oldValue) => {
			spy(value, oldValue);
		});

		proxy.push(1);
		expect(spy).toHaveBeenCalledWith(1, undefined);

		proxy.push(2, 3);
		expect(spy).toHaveBeenCalledWith(2, undefined);
		expect(spy).toHaveBeenCalledWith(3, undefined);
	});

	it('array concatenation with proxy', () => {
		const
			arrOne = [1, 2, 3],
			arrTwo = ['foo', 'bar'];

		const
			{proxy: proxyOne} = watch(arrOne, {immediate: true}),
			{proxy: proxyTwo} = watch(arrTwo, {immediate: true});

		const
			result = proxyOne.concat(proxyTwo);

		expect(result).toEqual([1, 2, 3, 'foo', 'bar']);
	});
});
