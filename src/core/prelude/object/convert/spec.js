/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/object/convert', () => {
	describe('`trySerialize`', () => {
		it('serializing of arrays and dictionaries', () => {
			expect(Object.trySerialize([1, 2])).toBe('[1,2]');
			expect(Object.trySerialize([1, [1]])).toBe('[1,[1]]');
			expect(Object.trySerialize({a: {b: 1}})).toBe('{"a":{"b":1}}');
		});

		it('serializing an object with the provided `replacer`', () => {
			const obj = {
				a: new Set([1, 2, 3])
			};

			const replacer = (key, val) => {
				if (key === 'a') {
					return [...val];
				}

				return val;
			};

			expect(Object.trySerialize(obj, replacer)).toBe('{"a":[1,2,3]}');
		});

		it('serializing of a string', () => {
			expect(Object.trySerialize('123')).toBe('"123"');
		});

		it('serializing of an object with the predefined `toJSON`', () => {
			const set = new Set([1, 2, 3]);
			set.toJSON = () => [...set];

			expect(Object.trySerialize(set)).toBe('[1,2,3]');
		});

		it('serializing of a number or boolean', () => {
			expect(Object.trySerialize(1)).toBe(1);
			expect(Object.trySerialize(true)).toBe(true);
		});

		it('serializing of null and undefined', () => {
			expect(Object.trySerialize(null)).toBeNull();
			expect(Object.trySerialize(undefined)).toBeUndefined();
		});

		it('serializing of a non-serializable object', () => {
			const set = new Set([1, 2, 3]);
			expect(Object.trySerialize(set)).toBe(set);
		});

		it('serializing of a non-serializable object with the specified `replacer`', () => {
			const
				set = new Set([1, 2, 3]);

			const replacer = (key, val) => {
				if (key === '') {
					return [...val];
				}

				return val;
			};

			expect(Object.trySerialize(set, replacer)).toBe('[1,2,3]');
		});

		it('serializing with an exception', () => {
			const arr = [1, 2, 3];

			arr.toJSON = () => {
				throw new Error('Boom!');
			};

			expect(Object.trySerialize(arr)).toBe(arr);
		});

		it('functional overloads', () => {
			const replacer = (key, val) => {
				if (key === '') {
					return [...val];
				}

				return val;
			};

			expect(Object.trySerialize(replacer)(new Set([1]))).toBe('[1]');
		});
	});

	describe('`parse`', () => {
		it('parsing of primitives', () => {
			expect(Object.parse('1')).toBe(1);
			expect(Object.parse('0.124')).toBe(0.124);
			expect(Object.parse('1e2')).toBe(100);
			expect(Object.parse('"1"')).toBe('1');
			expect(Object.parse('"😃😡"')).toBe('😃😡');
			expect(Object.parse('😃😡')).toBe('😃😡');
			expect(Object.parse('true')).toBe(true);
			expect(Object.parse('null')).toBe(null);
			expect(Object.parse('undefined')).toBe(undefined);
		});

		it('parsing of invalid numbers', () => {
			expect(Object.parse('.124')).toBe('.124');
			expect(Object.parse('1e309')).toBe('1e309');

			expect(Object.parse('Infinite')).toBe('Infinite');
			expect(Object.parse('-Infinite')).toBe('-Infinite');

			expect(Object.parse(String(Number.MAX_SAFE_INTEGER + 1))).toBe('9007199254740992');
			expect(Object.parse(String(Number.MIN_SAFE_INTEGER - 1))).toBe('-9007199254740992');
		});

		it('parsing of objects', () => {
			expect(Object.parse('{a: 1}')).toBe('{a: 1}');
			expect(Object.parse('{"a": 1}')).toEqual({a: 1});
		});

		it('providing a custom `reviver`', () => {
			const reviver = (key, val) => key === 'a' ? new Set(val) : val;
			expect(Object.parse('{"a": [1]}', reviver)).toEqual({a: new Set([1])});
		});

		it('providing the custom `reviver` with a non-parseable value', () => {
			// eslint-disable-next-line no-new-func
			const reviver = (key, val) => key === '' ? Function(`return ${val}`)() : val;
			expect(Object.parse('new Set([1])', reviver)).toEqual(new Set([1]));
		});

		it('functional overloads', () => {
			const reviver = (key, val) => key === 'a' ? new Set(val) : val;
			expect(Object.parse(reviver)('{"a": [1]}')).toEqual({a: new Set([1])});
		});

		it('providing __proto__ as a key', () => {
			expect(Object.parse('{"__proto__": {"foo": "bar"}}')).toEqual({});
		});
	});
});
