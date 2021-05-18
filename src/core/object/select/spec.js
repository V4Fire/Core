/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import select from 'core/object/select';

describe('core/object/select', () => {
	describe('searching into a plain object', () => {
		it('`where` is provided', () => {
			const obj = {
				foo: 1,
				bla: 2
			};

			expect(select(obj, {where: obj}))
				.toEqual(obj);

			expect(select(obj, {where: {foo: 1}}))
				.toEqual(obj);

			expect(select(obj, {where: {foo: 1, bla: 2}}))
				.toEqual(obj);

			expect(select(obj, {where: {foo: 1, bla: 3}}))
				.toBeUndefined();

			expect(select(obj, {where: {foo: 11}}))
				.toBeUndefined();

			expect(select(obj, {where: {}}))
				.toBeUndefined();
		});

		it("`where` isn't provided", () => {
			const obj = {
				foo: 1,
				bla: 2
			};

			expect(select(obj))
				.toBeUndefined();

			expect(select(obj, {from: 'foo'}))
				.toBe(1);
		});

		it('`where` as an array', () => {
			const obj = {
				foo: 1,
				bla: 2
			};

			expect(select(obj, {where: [{foo: 11}, {bla: 2}]}))
				.toEqual(obj);

			expect(select(obj, {where: [{foo: 11}, {bla: 22}]}))
				.toBeUndefined();

			expect(select(obj, {where: []}))
				.toBeUndefined();
		});

		it('`where` contains non-defined keys', () => {
			const obj = {
				foo: 1,
				bla: 2
			};

			expect(select(obj, {where: {b2: 1}}))
				.toBeUndefined();

			expect(select(obj, {where: {foo: 1, b2: 1}}))
				.toEqual(obj);
		});

		it('`from` is provided', () => {
			const obj = {
				a: {
					b: {
						c: new Map([[1, {foo: 1, baz: 2}]]),
						d: {
							foo: 1,
							bla: 2
						}
					}
				},

				1: 1
			};

			expect(select(obj, {from: 'a.b.d'}))
				.toEqual({foo: 1, bla: 2});

			expect(select(obj, {from: ['a', 'b', 'c', 1]}))
				.toEqual({foo: 1, baz: 2});

			expect(select(obj, {from: 1}))
				.toBe(1);
		});

		it('`from` and `where` are provided', () => {
			const obj = {
				a: {
					b: {
						c: new Map([[1, {foo: 1, baz: 2}]]),
						d: {
							foo: 1,
							bla: 2
						}
					}
				},

				1: 1
			};

			expect(select(obj, {from: 'a.b.d', where: {foo: 1}}))
				.toEqual({foo: 1, bla: 2});

			expect(select(obj, {from: ['a', 'b', 'c', 1], where: {foo: 11}}))
				.toBeUndefined();

			expect(select(obj, {from: 1, where: {baz: 1}}))
				.toBeUndefined();

			expect(select(obj, {from: 1, where: []}))
				.toBeUndefined();
		});
	});

	describe('searching into an iterable object', () => {
		it('`where` is provided', () => {
			const obj = [
				{foo: 1, bla: 2},
				{baz: 3}
			];

			expect(select(obj, {where: obj}))
				.toEqual(obj[0]);

			expect(select(obj, {where: {foo: 1}}))
				.toEqual(obj[0]);

			expect(select(obj, {where: {foo: 1, bla: 2}}))
				.toEqual(obj[0]);

			expect(select(obj, {where: {foo: 1, bla: 3}}))
				.toBeUndefined();

			expect(select(obj, {where: {foo: 11}}))
				.toBeUndefined();

			expect(select(obj, {where: {}}))
				.toBeUndefined();
		});

		it("`where` isn't provided", () => {
			const obj = new Set([
				{foo: 1, bla: 2},
				{baz: 3}
			]);

			expect(select(obj))
				.toBeUndefined();
		});

		it('`where` as an array', () => {
			const obj = new Map([
				[1, {foo: 1, bla: 2}],
				[{}, {baz: 3}]
			]);

			expect(select(obj, {where: [{foo: 11}, {bla: 2}]}))
				.toEqual(obj.get(0));

			expect(select(obj, {where: [{foo: 11}, {bla: 22}]}))
				.toBeUndefined();

			expect(select(obj, {where: []}))
				.toBeUndefined();
		});

		it('`where` contains non-defined keys', () => {
			const obj = [
				{foo: 1, bla: 2},
				{baz: 3}
			];

			expect(select(obj[Symbol.iterator](), {where: {b2: 1}}))
				.toBeUndefined();

			expect(select(obj[Symbol.iterator](), {where: {foo: 1, b2: 1}}))
				.toEqual({foo: 1, bla: 2});
		});

		it('`from` is provided', () => {
			const obj = [
				{
					a: {
						b: {
							c: new Map([[1, {foo: 1, baz: 2}]]),
							d: {
								foo: 1,
								bla: 2
							}
						}
					},

					1: 1
				}
			];

			expect(select(obj, {from: '0.a.b.d'}))
				.toEqual({foo: 1, bla: 2});

			expect(select(obj, {from: [0, 'a', 'b', 'c', 1]}))
				.toEqual({foo: 1, baz: 2});

			expect(select(obj, {from: [0, 1]}))
				.toBe(1);
		});

		it('`from` and `where` are provided', () => {
			const obj = [
				{
					a: {
						b: {
							c: new Map([[1, {foo: 1, baz: 2}]]),
							d: {
								foo: 1,
								bla: 2
							}
						}
					},

					1: 1
				}
			];

			expect(select(obj, {from: '0.a.b.d', where: {foo: 1}}))
				.toEqual({foo: 1, bla: 2});

			expect(select(obj, {from: [0, 'a', 'b', 'c', 1], where: {foo: 11}}))
				.toBeUndefined();

			expect(select(obj, {from: '0.1', where: {baz: 1}}))
				.toBeUndefined();

			expect(select(obj, {from: [0, 1], where: []}))
				.toBeUndefined();
		});
	});
});
