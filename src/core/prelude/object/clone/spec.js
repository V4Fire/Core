/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/object/clone/fastClone', () => {
	it('simple object cloning', () => {
		const
			obj1 = {};

		expect(Object.fastClone(obj1)).not.toBe(obj1);
		expect(Object.fastClone(obj1)).toEqual(obj1);

		const
			obj2 = {a: 1, b: {c: [1, 2, 3], d: new Date(), d2: '2017-02-03'}};

		expect(Object.fastClone(obj2)).not.toBe(obj2);
		expect(Object.fastClone(obj2)).toEqual(obj2);
	});

	it('simple array cloning', () => {
		const
			obj1 = [];

		expect(Object.fastClone(obj1)).not.toBe(obj1);
		expect(Object.fastClone(obj1)).toEqual(obj1);

		const
			obj2 = [1, 2, 3, new Date(), '2017-02-03'];

		expect(Object.fastClone(obj2)).not.toBe(obj2);
		expect(Object.fastClone(obj2)).toEqual(obj2);

		const
			obj3 = [{a: 1}, {b: 2}];

		expect(Object.fastClone(obj3)).not.toBe(obj3);
		expect(Object.fastClone(obj3)).toEqual(obj3);
	});

	it('cloning of objects with functions', () => {
		const obj = {a: 1, bla: () => 1};
		expect(Object.fastClone(obj)).not.toBe(obj);
		expect(Object.fastClone(obj)).toEqual(obj);
	});

	it('cloning of objects with cycle links', () => {
		const obj = {a: 1};
		obj.obj = obj;

		expect(Object.fastClone(obj)).not.toBe(obj);
		expect(Object.fastClone(obj)).toEqual(obj);
	});

	it('cloning of non extendable objects', () => {
		const
			obj = Object.preventExtensions({a: 1, b: 2}),
			clone = Object.fastClone(obj, {freezable: true});

		expect(clone).not.toBe(obj);
		expect(clone).toEqual(obj);
		expect(!Object.isExtensible(clone)).toBeTrue();
	});

	it('cloning of sealed objects', () => {
		const
			obj = Object.seal({a: 1, b: 2}),
			clone = Object.fastClone(obj, {freezable: true});

		expect(clone).not.toBe(obj);
		expect(clone).toEqual(obj);
		expect(Object.isSealed(clone)).toBeTrue();
	});

	it('cloning of frozen objects', () => {
		const
			obj = Object.freeze({a: 1, b: 2}),
			clone = Object.fastClone(obj, {freezable: true});

		expect(clone).not.toBe(obj);
		expect(clone).toEqual(obj);
		expect(Object.isFrozen(clone)).toBeTrue();
	});

	it('cloning of date objects', () => {
		const obj = new Date();
		expect(Object.fastClone(obj)).not.toBe(obj);
		expect(Object.fastClone(obj)).toEqual(obj);
	});

	it('cloning of functions', () => {
		const obj = () => 1;
		expect(Object.fastClone(obj)).toBe(obj);
	});

	it('cloning of map objects', () => {
		const obj = new Map([[1, 2], [2, {a: 1}]]);
		expect(Object.fastClone(obj)).not.toBe(obj);
		expect(Object.fastClone(obj)).toEqual(obj);
	});

	it('cloning of set objects', () => {
		const obj = new Set([{a: 1}]);
		expect(Object.fastClone(obj)).not.toBe(obj);
		expect(Object.fastClone(obj)).toEqual(obj);
	});

	it('custom revivers/replacers', () => {
		const
			obj = {a: new Set([1])};

		const clone = Object.fastClone(obj, {
			replacer: (key, obj) => Object.isSet(obj) ? [...obj] : obj,
			reviver: (key, obj) => Object.isArray(obj) ? new Set(obj) : obj
		});

		expect(clone).not.toBe(obj);
		expect(clone).toEqual(obj);
	});

	it('functional overload', () => {
		const
			obj = {a: new Set([1])};

		const clone = Object.fastClone(undefined, {
			replacer: (key, obj) => Object.isSet(obj) ? [...obj] : obj,
			reviver: (key, obj) => Object.isArray(obj) ? new Set(obj) : obj
		})(obj);

		expect(clone).not.toBe(obj);
		expect(clone).toEqual(obj);
	});
});
