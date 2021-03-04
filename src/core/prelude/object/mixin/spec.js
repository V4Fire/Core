/* eslint-disable max-lines-per-function, max-lines */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/object/mixin', () => {
	it('simple extending of an object', () => {
		const base = {
			a: 1,
			b: 2
		};

		const
			clone = Object.mixin(false, {}, base);

		expect(clone).not.toBe(base);
		expect(clone).toEqual(base);
	});

	it('simple extending of an object without specifying the base object', () => {
		const base = {
			a: 1,
			b: 2
		};

		const
			clone = Object.mixin(false, undefined, base);

		expect(clone).not.toBe(base);
		expect(clone).toEqual(base);
	});

	it('simple extending of an array', () => {
		const
			base = [1, 2],
			clone = Object.mixin(false, undefined, base);

		expect(clone).not.toBe(base);
		expect(clone).toEqual(base);
	});

	it('simple extending of a map', () => {
		const
			base = new Map([[0, 1], [1, 2]]),
			clone = Object.mixin(false, undefined, base);

		expect(clone).not.toBe(base);
		expect(clone).toEqual(base);
	});

	it('simple extend of a weak map', () => {
		const
			key1 = Object(0),
			key2 = Object(1);

		const
			base = new Map([[key1, 1], [key2, 2]]),
			clone = Object.mixin(false, new WeakMap(), base);

		expect(clone).not.toBe(base);
		expect(clone instanceof WeakMap).toBeTruthy();
		expect(clone.has(key1)).toBeTruthy();
		expect(clone.has(key2)).toBeTruthy();
	});

	it('simple extending of a set', () => {
		const
			base = new Set([1, 2]),
			clone = Object.mixin(false, undefined, base);

		expect(clone).not.toBe(base);
		expect(clone).toEqual(base);
	});

	it('simple extending of a weak set', () => {
		const
			key1 = Object(0),
			key2 = Object(1);

		const
			base = new Set([key1, key2]),
			clone = Object.mixin(false, new WeakSet(), base);

		expect(clone).not.toBe(base);
		expect(clone instanceof WeakSet).toBeTruthy();
		expect(clone.has(key1)).toBeTruthy();
		expect(clone.has(key2)).toBeTruthy();
	});

	it('extending of an object with undefined fields', () => {
		const base = {
			a: 1,
			b: 2,
			c: undefined
		};

		const
			clone1 = Object.mixin(false, undefined, base);

		expect(clone1).not.toBe(base);
		expect(clone1).toEqual({a: 1, b: 2});

		const
			clone2 = Object.mixin({withUndef: true}, undefined, base);

		expect(clone2).not.toBe(base);
		expect(clone2).toEqual(base);
	});

	it('extending of an object with new properties', () => {
		const base1 = {
			a: 1,
			b: 2
		};

		const base2 = {
			a: 2,
			c: 3
		};

		expect(Object.mixin({onlyNew: true}, undefined, base1, base2)).toEqual({
			a: 1,
			b: 2,
			c: 3
		});
	});

	it('extending of an object with not new properties', () => {
		const base1 = {
			a: 1,
			b: 2
		};

		const base2 = {
			a: 2,
			c: 3
		};

		expect(Object.mixin({onlyNew: -1}, base1, base2)).toEqual({
			a: 2,
			b: 2
		});
	});

	it('extending of an object with accessors', () => {
		const base = {
			_a: 1,

			get a() {
				return this._a;
			},

			set a(value) {
				this._a = value;
			}
		};

		const
			clone = Object.mixin({withAccessors: true}, undefined, base);

		expect(clone).not.toBe(base);
		expect(clone._a).toBe(1);

		clone.a = 2;
		expect(clone._a).toBe(2);
	});

	it('extending of an object with descriptors', () => {
		const
			base = {};

		Object.defineProperty(base, 'a', {
			enumerable: true,
			writable: false,
			value: 1
		});

		const
			clone = Object.mixin({withDescriptor: true}, undefined, base);

		expect(clone).not.toBe(base);
		expect(Object.getOwnPropertyDescriptor(clone, 'a')).toEqual({
			enumerable: true,
			configurable: false,
			writable: false,
			value: 1
		});
	});

	it('extending of an object with the prototype', () => {
		const proto = {
			a: 1,
			b: {
				c: 2,
				arr: [1]
			}
		};

		const
			base1 = Object.create(proto);

		Object.mixin(false, base1, {
			a: 2,
			b: {
				e: 3,
				arr: [2]
			}
		});

		expect(base1).toEqual({
			a: 2,
			b: {
				e: 3,
				arr: [2]
			}
		});

		expect(proto).toEqual({
			a: 1,
			b: {
				c: 2,
				arr: [1]
			}
		});

		const
			base2 = Object.create(proto);

		Object.mixin({deep: true, withProto: true}, base2, {
			a: 2,
			b: {
				e: 3
			}
		});

		expect(base2).toEqual({
			a: 2,
			b: {
				e: 3
			}
		});

		expect(proto).toEqual({
			a: 1,
			b: {
				c: 2,
				arr: [1]
			}
		});

		expect(Object.mixin({deep: true, withProto: true}, {}, base2)).toEqual({
			a: 2,
			b: {
				c: 2,
				e: 3,
				arr: [1]
			}
		});

		const
			base3 = Object.create(proto);

		Object.mixin({deep: true, withProto: true}, base3, {
			a: 2,
			b: {
				c: 3,
				arr: [1]
			}
		});

		expect(base3).toEqual({
			a: 2,
			b: {
				c: 3,
				arr: [1]
			}
		});

		expect(proto).toEqual({
			a: 1,
			b: {
				c: 2,
				arr: [1]
			}
		});

		const
			base4 = Object.create(proto);

		Object.mixin({deep: true}, base4, {
			a: 2,
			b: {
				c: 3,
				arr: [1]
			}
		});

		expect(base4).toEqual({
			a: 2,
			b: {
				c: 3,
				arr: [1]
			}
		});

		expect(proto).toEqual({
			a: 1,
			b: {
				c: 3,
				arr: [1]
			}
		});
	});

	it('deep extending', () => {
		const base = {
			a: {
				b: 2
			},

			c: new Set([1, 2, 3]),
			d: [1, 2, 3]
		};

		Object.mixin(true, base, {
			a: {
				b: 3,
				b2: 3
			},

			c: new Set([4]),
			d: [2, 3]
		});

		expect(base).toEqual({
			a: {
				b: 3,
				b2: 3
			},

			c: new Set([1, 2, 3, 4]),
			d: [2, 3, 3]
		});
	});

	it('deep extending with not own properties', () => {
		expect(Object.mixin(false, {}, {__proto__: {a: 1}})).toEqual({});
		expect(Object.mixin(true, {}, {__proto__: {a: 1}})).toEqual({a: 1});
	});

	it('deep extending with the concatenation of arrays', () => {
		const base = {
			a: [1, 2, 3]
		};

		Object.mixin({deep: true, concatArray: true}, base, {
			a: [2, 3]
		});

		expect(base).toEqual({
			a: [1, 2, 3, 2, 3]
		});
	});

	it('deep extending with the custom array concatenation', () => {
		const base = {
			a: [1, 2, 3]
		};

		const
			concatFn = (a, b) => [...new Set(a.concat(b))];

		Object.mixin({deep: true, concatArray: true, concatFn}, base, {
			a: [2, 3, 4]
		});

		expect(base).toEqual({
			a: [1, 2, 3, 4]
		});
	});

	it('deep extending with {arrayConcat: true, withProto: true}', () => {
		const proto = {
			a: [1, 2, 3]
		};

		const clone = Object.mixin({deep: true, concatArray: true}, Object.create(proto), {
			a: [2, 3]
		});

		expect(clone).toEqual({
			a: [1, 2, 3, 2, 3]
		});

		expect(proto).toEqual({
			a: [1, 2, 3]
		});
	});

	it('deep extending with the custom filter', () => {
		const base = {
			a: {
				b: 2
			},

			c: new Set([1, 2, 3])
		};

		const filter = (val) => {
			if (val instanceof Set) {
				return false;
			}

			return true;
		};

		Object.mixin({deep: true, filter}, base, {
			a: {
				b: 3,
				b2: 3
			},

			c: new Set([4])
		});

		expect(base).toEqual({
			a: {
				b: 3,
				b2: 3
			},

			c: new Set([1, 2, 3])
		});
	});

	it('deep extending with the custom extend filter', () => {
		const base = {
			a: {
				b: 2
			},

			c: new Set([1, 2, 3])
		};

		const
			extendFilter = (val) => !(val instanceof Set);

		Object.mixin({deep: true, extendFilter}, base, {
			a: {
				b: 3,
				b2: 3
			},

			c: new Set([4])
		});

		expect(base).toEqual({
			a: {
				b: 3,
				b2: 3
			},

			c: new Set([4])
		});
	});

	it('functional overloads', () => {
		expect(Object.mixin({onlyNew: true})({a: 1}, {a: 2, b: 2})).toEqual({a: 1, b: 2});
		expect(Object.mixin({onlyNew: true}, {a: 1})({a: 2, b: 2})).toEqual({a: 1, b: 2});
	});
});
