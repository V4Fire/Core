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
		it(`watching for an object (${type})`, () => {
			const
				obj = {a: 1, b: 2},
				spy = jasmine.createSpy();

			const {proxy} = watch(obj, {immediate: true, engine}, (value, oldValue) => {
				spy(value, oldValue);
			});

			proxy.a = 2;
			expect(spy).toHaveBeenCalledWith(2, 1);

			proxy.b = 4;
			expect(spy).toHaveBeenCalledWith(4, 2);
		});

		it(`deep watching for an object (${type})`, () => {
			const
				obj = {a: {b: [], c: {e: 1}}},
				spy = jasmine.createSpy();

			const {proxy} = watch(obj, {immediate: true, deep: true, engine}, (value, oldValue) => {
				spy(value, oldValue);
			});

			proxy.a.b = [1, 2, 3];
			expect(spy).toHaveBeenCalledWith([1, 2, 3], []);

			proxy.a.c.e = 4;
			expect(spy).toHaveBeenCalledWith(4, 1);
		});

		it(`watching for an array (${type})`, () => {
			const
				arr = [],
				spy = jasmine.createSpy();

			const {proxy} = watch(arr, {immediate: true, engine}, (value, oldValue, info) => {
				spy(value, oldValue, info.path);
			});

			expect(proxy.push(1)).toBe(1);
			expect(spy).toHaveBeenCalledWith(1, undefined, [0]);
			expect(arr).toEqual([1]);

			expect(proxy.push(2, 3)).toBe(3);
			expect(spy).toHaveBeenCalledWith(2, undefined, [1]);
			expect(spy).toHaveBeenCalledWith(3, undefined, [2]);
			expect(arr).toEqual([1, 2, 3]);

			expect(proxy.pop()).toBe(3);
			expect(spy).toHaveBeenCalledWith(2, 3, ['length']);
			expect(arr).toEqual([1, 2]);

			expect(proxy.unshift(7)).toBe(3);
			expect(spy).toHaveBeenCalledWith(2, undefined, [2]);
			expect(spy).toHaveBeenCalledWith(1, 2, [1]);
			expect(spy).toHaveBeenCalledWith(7, 1, [0]);
			expect(arr).toEqual([7, 1, 2]);

			expect(proxy.unshift(5, 9)).toBe(5);
			expect(spy).toHaveBeenCalledWith(2, undefined, [4]);
			expect(spy).toHaveBeenCalledWith(1, undefined, [3]);
			expect(spy).toHaveBeenCalledWith(7, 2, [2]);
			expect(spy).toHaveBeenCalledWith(5, 7, [0]);
			expect(spy).toHaveBeenCalledWith(9, 1, [1]);
			expect(arr).toEqual([5, 9, 7, 1, 2]);

			expect(proxy.shift()).toBe(5);
			expect(spy).toHaveBeenCalledWith(9, 5, [0]);
			expect(arr).toEqual([9, 7, 1, 2]);

			expect(proxy.splice(1, 2, 98)).toEqual([7, 1]);
			expect(spy).toHaveBeenCalledWith(2, 1, [2]);
			expect(spy).toHaveBeenCalledWith(98, 7, [1]);
			expect(spy).toHaveBeenCalledWith(3, 4, ['length']);
			expect(arr).toEqual([9, 98, 2]);

			expect(proxy.splice(0, 0, 1, 2, 3, 4)).toEqual([]);
			expect(spy).toHaveBeenCalledWith(2, undefined, [6]);
			expect(spy).toHaveBeenCalledWith(98, undefined, [5]);
			expect(spy).toHaveBeenCalledWith(9, undefined, [4]);
			expect(spy).toHaveBeenCalledWith(1, 9, [0]);
			expect(spy).toHaveBeenCalledWith(2, 98, [1]);
			expect(spy).toHaveBeenCalledWith(3, 2, [2]);
			expect(spy).toHaveBeenCalledWith(4, undefined, [3]);
			expect(arr).toEqual([1, 2, 3, 4, 9, 98, 2]);
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

		it(`watching for a set (${type})`, () => {
			const
				set = new Set([]),
				spy = jasmine.createSpy();

			const {proxy} = watch(set, {immediate: true, engine}, (value, oldValue, info) => {
				spy(value, oldValue, info.path);
			});

			expect(proxy.add(1)).toBe(proxy);
			expect(spy).toHaveBeenCalledWith(1, undefined, [1]);
			expect(set.has(1)).toBeTrue();

			expect(proxy.add(2)).toBe(proxy);
			expect(spy).toHaveBeenCalledWith(2, undefined, [2]);
			expect(set.has(2)).toBeTrue();

			expect(proxy.delete(2)).toBeTrue();
			expect(spy).toHaveBeenCalledWith(undefined, 2, [2]);
			expect(set.has(2)).toBeFalse();

			expect(proxy.clear()).toBeUndefined();
			expect(spy).toHaveBeenCalledWith(undefined, undefined, []);
			expect(set.has(1)).toBeFalse();
		});

		it(`watching for a weak set (${type})`, () => {
			const
				set = new WeakSet([]),
				spy = jasmine.createSpy();

			const {proxy} = watch(set, {immediate: true, engine}, (value, oldValue, info) => {
				spy(value, oldValue, info.path);
			});

			const
				key1 = [];

			expect(proxy.add(key1)).toBe(proxy);
			expect(spy).toHaveBeenCalledWith(key1, undefined, [key1]);
			expect(set.has(key1)).toBeTrue();

			const
				key2 = {};

			expect(proxy.add(key2)).toBe(proxy);
			expect(spy).toHaveBeenCalledWith(key2, undefined, [key2]);
			expect(set.has(key2)).toBeTrue();

			expect(proxy.delete(key2)).toBeTrue();
			expect(spy).toHaveBeenCalledWith(undefined, key2, [key2]);
			expect(set.has(key2)).toBeFalse();
		});

		it(`watching for a map (${type})`, () => {
			const
				map = new Map([[0, 1], [1, 2]]),
				spy = jasmine.createSpy();

			const {proxy} = watch(map, {immediate: true, engine}, (value, oldValue, info) => {
				spy(value, oldValue, info.path);
			});

			expect(proxy.set(0, 2)).toBe(proxy);
			expect(spy).toHaveBeenCalledWith(2, 1, [0]);
			expect(map.get(0)).toBe(2);

			expect(proxy.set(5, 2)).toBe(proxy);
			expect(spy).toHaveBeenCalledWith(2, undefined, [5]);
			expect(map.get(5)).toBe(2);

			expect(proxy.delete(5)).toBeTrue();
			expect(spy).toHaveBeenCalledWith(undefined, 2, [5]);
			expect(map.has(5)).toBeFalse();

			expect(proxy.clear()).toBeUndefined();
			expect(spy).toHaveBeenCalledWith(undefined, undefined, []);
			expect(map.has(0)).toBeFalse();
			expect(map.has(1)).toBeFalse();
		});

		it(`watching for a weak map (${type})`, () => {
			const
				map = new WeakMap([]),
				spy = jasmine.createSpy();

			const {proxy} = watch(map, {immediate: true, engine}, (value, oldValue, info) => {
				spy(value, oldValue, info.path);
			});

			const
				key1 = [];

			expect(proxy.set(key1, 2)).toBe(proxy);
			expect(spy).toHaveBeenCalledWith(2, undefined, [key1]);
			expect(map.get(key1)).toBe(2);

			const
				key2 = {};

			expect(proxy.set(key2, 23)).toBe(proxy);
			expect(spy).toHaveBeenCalledWith(23, undefined, [key2]);
			expect(map.get(key2)).toBe(23);

			expect(proxy.delete(key2)).toBeTrue();
			expect(spy).toHaveBeenCalledWith(undefined, 23, [key2]);
			expect(map.has(key2)).toBeFalse();
		});
	});
});
