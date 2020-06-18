/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/object/iterators/forEach', () => {
	it('iteration of an array', () => {
		const
			data = [1, 2, 3],
			scan = [];

		Object.forEach(data, (...args) => {
			scan.push(args);
		});

		expect(scan).toEqual([
			[1, 0, data],
			[2, 1, data],
			[3, 2, data]
		]);
	});

	it('iteration of a string', () => {
		const
			data = 'foo',
			scan = [];

		Object.forEach(data, (...args) => {
			scan.push(args);
		});

		expect(scan).toEqual([
			['f', 0, data],
			['o', 1, data],
			['o', 2, data]
		]);
	});

	it('iteration of a string with surrogate pairs', () => {
		const
			data = '😃😡',
			scan = [];

		Object.forEach(data, (...args) => {
			scan.push(args);
		});

		expect(scan).toEqual([
			['😃', 0, data],
			['😡', 1, data]
		]);
	});

	it('iteration of a Map', () => {
		const
			data = new Map([[0, 1], [1, 2], [2, 3]]),
			scan = [];

		Object.forEach(data, (...args) => {
			scan.push(args);
		});

		expect(scan).toEqual([
			[1, 0, data],
			[2, 1, data],
			[3, 2, data]
		]);
	});

	it('iteration of a Set', () => {
		const
			data = new Set([1, 2, 3]),
			scan = [];

		Object.forEach(data, (...args) => {
			scan.push(args);
		});

		expect(scan).toEqual([
			[1, 1, data],
			[2, 2, data],
			[3, 3, data]
		]);
	});

	it('iteration of an iterator', () => {
		const
			data = [1, 2, 3].values(),
			scan = [];

		Object.forEach(data, (...args) => {
			scan.push(args);
		});

		expect(scan).toEqual([
			[1, null, data],
			[2, null, data],
			[3, null, data]
		]);
	});

	it('iteration of an object', () => {
		const
			data = {a: 1, b: 2, __proto__: {c: 3}},
			scan = [];

		Object.forEach(data, (...args) => {
			scan.push(args);
		});

		expect(scan).toEqual([
			[1, 'a', data],
			[2, 'b', data]
		]);
	});

	it('iteration of an object with descriptors', () => {
		const
			data = {a: 1, b: 2, __proto__: {c: 3}},
			scan = [];

		Object.forEach(data, {withDescriptor: true}, (...args) => {
			scan.push(args);
		});

		expect(scan).toEqual([
			[{value: 1, enumerable: true, writable: true, configurable: true}, 'a', data],
			[{value: 2, enumerable: true, writable: true, configurable: true}, 'b', data]
		]);
	});

	it('iteration of an object with adding of inherited properties', () => {
		const
			data = {a: 1, b: 2, __proto__: {c: 3}},
			scan = [];

		Object.forEach(data, {notOwn: true}, (...args) => {
			scan.push(args);
		});

		expect(scan).toEqual([
			[1, 'a', data],
			[2, 'b', data],
			[3, 'c', data]
		]);
	});

	it('iteration of an object with skipping of own properties', () => {
		const
			data = {a: 1, b: 2, __proto__: {c: 3}},
			scan = [];

		Object.forEach(data, {notOwn: -1}, (...args) => {
			scan.push(args);
		});

		expect(scan).toEqual([[3, 'c', data]]);
	});

	it('iteration of an iterator with object flags', () => {
		const
			data = Object.assign([1, 2, 3].values(), {a: 1}),
			scan = [];

		Object.forEach(data, {notOwn: false}, (...args) => {
			scan.push(args);
		});

		expect(scan).toEqual([[1, 'a', data]]);
	});
});
