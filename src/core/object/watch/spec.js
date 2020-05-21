/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import watch from 'core/object/watch';

import * as proxyEngine from 'core/object/watch/engines/proxy';
import * as accEngine from 'core/object/watch/engines/accessors';

describe('core/object/watch', () => {
	const engines = new Map([
		['default', undefined],
		['proxy', proxyEngine],
		['accessors', accEngine]
	]);

	engines.forEach((engine, type) => {
		it(`watching for an array (${type})`, () => {
			const
				arr = [],
				spy = jasmine.createSpy();

			const {proxy} = watch(arr, {immediate: true, engine}, (value, oldValue) => {
				spy(value, oldValue);
			});

			proxy.push(1);
			expect(spy).toHaveBeenCalledWith(1, undefined);

			proxy.push(2, 3);
			expect(spy).toHaveBeenCalledWith(2, undefined);
			expect(spy).toHaveBeenCalledWith(3, undefined);
		});

		it(`array concatenation with proxy (${type})`, () => {
			const
				arrOne = [1, 2, 3],
				arrTwo = ['foo', 'bar'];

			const
				{proxy: proxyOne} = watch(arrOne, {immediate: true, engine}),
				{proxy: proxyTwo} = watch(arrTwo, {immediate: true, engine});

			const
				result = proxyOne.concat(proxyTwo);

			expect(result).toEqual([1, 2, 3, 'foo', 'bar']);
		});
	});
});
