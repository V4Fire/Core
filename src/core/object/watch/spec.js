/* eslint-disable max-lines */
/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import watch, { mute, unmute, unwatchable, set, unset, isProxy } from 'core/object/watch';

import * as proxyEngine from 'core/object/watch/engines/proxy';
import * as accEngine from 'core/object/watch/engines/accessors';

describe('core/object/watch', () => {
	const engines = new Map([
		['default', undefined],
		['proxy', proxyEngine],
		['accessors', accEngine]
	]);

	engines.forEach((engine, engineName) => {
		describe(`with the "${engineName}" engine`, () => {
			it('simple watching for an object', (done) => {
				const
					obj = {a: 1, b: 2},
					spy = jest.fn();

				const {proxy} = watch(obj, {engine}, (mutations) => {
					spy(mutations.map((el) => el.slice(0, 2).concat(el[2].path)));
				});

				proxy.a = 2;
				expect(spy).not.toHaveBeenCalled();

				proxy.a = 3;
				expect(spy).not.toHaveBeenCalled();

				proxy.b = 4;
				expect(spy).not.toHaveBeenCalled();

				setTimeout(() => {
					expect(spy).toHaveBeenCalledWith([[2, 1, 'a'], [3, 2, 'a'], [4, 2, 'b']]);
					done();
				}, 15);
			});

			it('watching for an object with the `immediate` option', () => {
				const
					obj = {a: 1, b: 2},
					spy = jest.fn();

				const {proxy} = watch(obj, {immediate: true, engine}, (value, oldValue) => {
					spy(value, oldValue);
				});

				proxy.a = 2;
				expect(spy).toHaveBeenCalledWith(2, 1);

				proxy.b = 4;
				expect(spy).toHaveBeenCalledWith(4, 2);
			});

			it('watching for an object with collapsing', (done) => {
				const
					obj = {a: 1, b: 2},
					spy = jest.fn();

				const {proxy} = watch(obj, {collapse: true, engine}, (mutations) => {
					spy(mutations.map((el) => el.slice(0, 2).concat(el[2].path)));
				});

				proxy.a = 2;
				expect(spy).not.toHaveBeenCalled();

				proxy.a = 3;
				expect(spy).not.toHaveBeenCalled();

				proxy.b = 4;
				expect(spy).not.toHaveBeenCalled();

				setTimeout(() => {
					expect(spy).toHaveBeenCalledWith([[2, 1, 'a'], [3, 2, 'a'], [4, 2, 'b']]);
					done();
				}, 15);
			});

			it('deep watching for an object', () => {
				const
					obj = {a: {b: [], c: {e: 1}}},
					spy = jest.fn();

				const {proxy} = watch(obj, {immediate: true, deep: true, engine}, (value, oldValue) => {
					spy(value, oldValue);
				});

				// eslint-disable-next-line no-self-assign
				proxy.a = proxy.a;
				expect(spy).not.toHaveBeenCalled();

				proxy.a.b = [1, 2, 3];
				expect(spy).toHaveBeenCalledWith([1, 2, 3], []);

				proxy.a.c.e = 4;
				expect(spy).toHaveBeenCalledWith(4, 1);
			});

			it('deep watching for an object by a complex path', () => {
				const
					obj = {a: {b: []}, c: {e: 1}};

				{
					const
						spy = jest.fn();

					const {proxy} = watch(obj, 'a.b', {immediate: true, engine}, (value, oldValue) => {
						spy(value, oldValue);
					});

					proxy.a.b = [1, 2, 3];
					expect(spy).toHaveBeenCalledWith([1, 2, 3], []);
				}

				{
					const
						spy = jest.fn();

					const {proxy} = watch(obj, 'c.e', {immediate: true, engine}, (value, oldValue) => {
						spy(value, oldValue);
					});

					proxy.c = {e: 1};
					expect(spy).not.toHaveBeenCalled();

					proxy.c = {e: 2};
					expect(spy).toHaveBeenCalledWith(2, 1);

					proxy.c.e++;
					expect(spy).toHaveBeenCalledWith(3, 2);
				}
			});

			it('deep watching for an object by a complex path with collapsing', async () => {
				const
					obj = {a: {b: []}};

				const
					spy = jest.fn();

				const {proxy} = watch(obj, 'a.b', {engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path, info.originalPath);
				});

				proxy.a.b.push(1);
				proxy.a.b.push(2);
				await new Promise((r) => setTimeout(r, 15));

				expect(spy).toHaveBeenCalledWith([1, 2], [1, 2], ['a', 'b'], ['a', 'b', 1]);
			});

			it('deep watching for an object by a complex path without collapsing', async () => {
				const
					obj = {a: {b: []}};

				const
					spy = jest.fn();

				const {proxy} = watch(obj, 'a.b', {engine, collapse: false}, (mutations) => {
					mutations.forEach(([value, oldValue, info]) => {
						spy(value, oldValue, info.path, info.originalPath);
					});
				});

				proxy.a.b.push(1);
				proxy.a.b.push(2);
				await new Promise((r) => setTimeout(r, 15));

				expect(spy).toHaveBeenCalledWith(1, undefined, ['a', 'b'], ['a', 'b', 0]);
				expect(spy).toHaveBeenCalledWith(2, undefined, ['a', 'b'], ['a', 'b', 1]);
			});

			it('deep watching for an array by a complex path without collapsing', async () => {
				const
					obj = {a: {b: []}};

				const
					spy = jest.fn();

				const {proxy} = watch(obj, 'a.b.0', {engine, collapse: false}, (mutations) => {
					mutations.forEach(([value, oldValue, info]) => {
						spy(value, oldValue, info.path, info.originalPath);
					});
				});

				proxy.a.b.push(1);
				proxy.a.b.unshift({e: 2});

				await new Promise((r) => setTimeout(r, 15));

				expect(spy).toHaveBeenCalledWith(1, undefined, ['a', 'b', '0'], ['a', 'b', 0]);
				expect(spy).toHaveBeenCalledWith({e: 2}, 1, ['a', 'b', '0'], ['a', 'b', 0]);

				if (engineName === 'proxy') {
					proxy.a.b[0].e++;

					await new Promise((r) => setTimeout(r, 15));
					expect(spy).toHaveBeenCalledWith(3, 2, ['a', 'b', '0'], ['a', 'b', 0, 'e']);
				}
			});

			it('isolated watchers', () => {
				const
					obj = {a: {b: [], c: {e: 1}}},
					spy1 = jest.fn().mockName('spy1'),
					spy2 = jest.fn().mockName('spy2');

				const handler = (spy) => (value, oldValue) => {
					spy(value, oldValue);
				};

				const
					{proxy: proxy1} = watch(obj, {immediate: true, deep: true, engine}, handler(spy1)),
					{proxy: proxy2} = watch(obj, {immediate: true, deep: true, engine}, handler(spy2));

				proxy1.a.b = [1, 2, 3];
				expect(spy1).toHaveBeenCalledWith([1, 2, 3], []);
				expect(spy2).not.toHaveBeenCalled();

				proxy2.a.c.e = 4;
				expect(spy1).toHaveBeenCalledTimes(1);
				expect(spy2).toHaveBeenCalledWith(4, 1);
			});

			it('shared watchers', () => {
				const
					obj = {a: {b: [], c: {e: 1}}},
					spy1 = jest.fn().mockName('spy1'),
					spy2 = jest.fn().mockName('spy2');

				const handler = (spy) => (value, oldValue) => {
					spy(value, oldValue);
				};

				const
					{proxy: proxy1} = watch(obj, {immediate: true, deep: true, engine}, handler(spy1)),
					{proxy: proxy2} = watch(proxy1, {immediate: true, deep: true, engine}, handler(spy2));

				proxy1.a.b = [1, 2, 3];
				expect(spy1).toHaveBeenCalledWith([1, 2, 3], []);
				expect(spy2).toHaveBeenCalledWith([1, 2, 3], []);

				proxy2.a.c.e = 4;
				expect(spy1).toHaveBeenCalledWith(4, 1);
				expect(spy2).toHaveBeenCalledWith(4, 1);
			});

			it('deep watching for an object with prototypes', () => {
				const
					obj = {a: {b: [], __proto__: {c: {e: 1}}}},
					protoSpy = jest.fn().mockName('with the prototype'),
					nonProtoSpy = jest.fn().mockName('without the prototype');

				const handler = (spy) => (value, oldValue, info) => {
					spy(value, oldValue, info.fromProto);
				};

				const
					{proxy: protoProxy} = watch(obj, {immediate: true, deep: true, withProto: true, engine}, handler(protoSpy)),
					{proxy: nonProtoProxy} = watch(protoProxy, {immediate: true, deep: true, engine}, handler(nonProtoSpy));

				protoProxy.a.b = [1, 2, 3];
				expect(protoSpy).toHaveBeenCalledWith([1, 2, 3], [], false);
				expect(nonProtoSpy).toHaveBeenCalledWith([1, 2, 3], [], false);

				nonProtoProxy.a.c.e = 4;
				expect(protoSpy).toHaveBeenCalledWith(4, 1, true);
				expect(nonProtoSpy).toHaveBeenCalledTimes(1);
			});

			it('deep watching with collapsing', (done) => {
				const
					obj = {a: {b: [], c: {e: 1}}, c: []},
					spy = jest.fn();

				const opts = {
					deep: true,
					collapse: true,
					engine
				};

				const {proxy} = watch(obj, opts, (mutations) => {
					spy(mutations.map((el) => el.slice(0, 2).concat(el[2].path)));
				});

				proxy.c.push(1);
				expect(spy).not.toHaveBeenCalled();

				proxy.a.b.push(1);
				expect(spy).not.toHaveBeenCalled();

				proxy.a.c.e = 2;
				expect(spy).not.toHaveBeenCalled();

				setTimeout(() => {
					expect(spy).toHaveBeenCalledWith([
						[[1], [1], 'c', 0],
						[{b: [1], c: {e: 2}}, {b: [1], c: {e: 2}}, 'a', 'b', 0],
						[{b: [1], c: {e: 2}}, {b: [1], c: {e: 2}}, 'a', 'c', 'e']
					]);

					done();
				}, 15);
			});

			it('deep watching with collapsing and the `immediate` option', () => {
				const
					obj = {a: {b: [], c: {e: 1}}, c: []},
					spy = jest.fn();

				const opts = {
					immediate: true,
					deep: true,
					collapse: true,
					engine
				};

				const {proxy} = watch(obj, opts, (value, oldValue) => {
					spy(value, oldValue);
				});

				proxy.c.push(1);
				expect(spy).toHaveBeenCalledWith([1], [1]);

				proxy.a.b.push(1);
				expect(spy).toHaveBeenCalledWith({b: [1], c: {e: 1}}, {b: [1], c: {e: 1}});

				proxy.a.c.e = 2;
				expect(spy).toHaveBeenCalledWith({b: [1], c: {e: 2}}, {b: [1], c: {e: 2}});
			});

			it('watching for getters with prefixes and postfixes', () => {
				const obj = {
					_a: 1,

					get a() {
						return this._a * 2;
					},

					b: {
						$foo: {
							a: {
								b: 1
							}
						},

						get fooStore() {
							return this.$foo;
						},

						get foo() {
							return this.fooStore.a.b * 3;
						}
					}
				};

				const
					spy = jest.fn().mockName('global'),
					localSpy = jest.fn().mockName('local');

				const opts = {
					immediate: true,
					deep: true,
					prefixes: ['_', '$'],
					postfixes: ['Store'],
					engine
				};

				const {proxy} = watch(obj, opts, (value, oldValue, info) => {
					spy(value, oldValue, info.path, info.parent && Object.select(info.parent, /value/i));
				});

				proxy._a = 2;
				expect(spy).toHaveBeenCalledWith(2, 1, ['_a'], undefined);
				expect(spy).toHaveBeenCalledWith(4, undefined, ['a'], {value: 2, oldValue: 1});

				proxy._a = 3;
				expect(spy).toHaveBeenCalledWith(3, 2, ['_a'], undefined);
				expect(spy).toHaveBeenCalledWith(6, 4, ['a'], {value: 3, oldValue: 2});

				proxy._a = 2;
				expect(spy).toHaveBeenCalledWith(2, 1, ['_a'], undefined);
				expect(spy).toHaveBeenCalledWith(4, undefined, ['a'], {value: 2, oldValue: 1});

				watch(proxy, 'b.foo', opts, (value, oldValue, info) => {
					localSpy(value, oldValue, info.path);
				});

				proxy.b.fooStore.a.b = 3;
				expect(spy).toHaveBeenCalledWith(3, 1, ['b', 'fooStore', 'a', 'b'], undefined);
				expect(spy).toHaveBeenCalledWith(undefined, undefined, ['b', 'foo', 'a', 'b'], {value: 3, oldValue: 1});
				expect(localSpy).toHaveBeenCalledWith(9, undefined, ['b', 'foo']);
			});

			it('watching for getters with dependencies', () => {
				const fork = () => ({
					_a: 1,

					get a() {
						return this._a * 2;
					},

					b: {
						$foo: {
							a: {
								b: 1
							}
						},

						get fooStore() {
							return this.$foo;
						},

						get foo() {
							return this.fooStore.a.b * 3;
						}
					}
				});

				const deps = [
					{
						a: ['_a'],
						'b.foo': [['b', 'fooStore']],
						fooStore: ['b.$foo']
					},

					new Map([
						['a', ['_a']],
						[['b', 'foo'], [['b', 'fooStore']]],
						['fooStore', ['b.$foo']]
					])
				];

				for (let i = 0; i < deps.length; i++) {
					const
						obj = fork(),
						spy = jest.fn().mockName('global'),
						localSpy = jest.fn().mockName('local');

					const opts = {
						immediate: true,
						deep: true,
						dependencies: deps[i],
						engine
					};

					const {proxy} = watch(obj, opts, (value, oldValue, info) => {
						spy(value, oldValue, info.path, info.parent && Object.select(info.parent, /value/i));
					});

					proxy._a = 2;
					expect(spy).toHaveBeenCalledWith(2, 1, ['_a'], undefined);
					expect(spy).toHaveBeenCalledWith(4, undefined, ['a'], {value: 2, oldValue: 1});

					proxy._a = 3;
					expect(spy).toHaveBeenCalledWith(3, 2, ['_a'], undefined);
					expect(spy).toHaveBeenCalledWith(6, 4, ['a'], {value: 3, oldValue: 2});

					watch(proxy, 'b.foo', opts, (value, oldValue, info) => {
						localSpy(value, oldValue, info.path);
					});

					proxy.b.fooStore.a.b = 3;
					expect(spy).toHaveBeenCalledWith(3, 1, ['b', 'fooStore', 'a', 'b'], undefined);
					expect(spy).toHaveBeenCalledWith(9, undefined, ['b', 'foo'], {value: 3, oldValue: 1});
					expect(localSpy).toHaveBeenCalledWith(9, undefined, ['b', 'foo']);
				}
			});

			it('watching for the particular getter with dependencies', () => {
				const obj = {
					_a: 1,

					get a() {
						return this._a * 2;
					}
				};

				const
					spy = jest.fn().mockName('global');

				const opts = {
					immediate: true,
					dependencies: ['_a'],
					engine
				};

				const {proxy} = watch(obj, 'a', opts, (value, oldValue, info) => {
					spy(value, oldValue, info.path, info.parent && Object.select(info.parent, /value/i));
				});

				proxy._a = 2;
				expect(spy).toHaveBeenCalledWith(4, undefined, ['a'], {value: 2, oldValue: 1});

				proxy._a = 5;
				expect(spy).toHaveBeenCalledWith(10, 4, ['a'], {value: 5, oldValue: 2});
			});

			it('watching for an array', () => {
				const
					arr = [],
					spy = jest.fn();

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

			it('array concatenation with proxy', () => {
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

			it("watching for an array' iterator", () => {
				const
					arr = [{a: 1}],
					spy = jest.fn();

				const {proxy} = watch(arr, {deep: true, immediate: true, engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path);
				});

				[...proxy][0].a++;
				expect(spy).toHaveBeenCalledWith(2, 1, [0, 'a']);
				expect(arr).toEqual([{a: 2}]);

				[...proxy.values()][0].a++;
				expect(spy).toHaveBeenCalledWith(3, 2, [0, 'a']);
				expect(arr).toEqual([{a: 3}]);

				[...proxy.entries()][0][1].a++;
				expect(spy).toHaveBeenCalledWith(4, 3, [0, 'a']);
				expect(arr).toEqual([{a: 4}]);

				expect([...proxy.keys()].length).toBe(1);
			});

			it('watching for a set', () => {
				const
					set = new Set([]),
					spy = jest.fn();

				const {proxy} = watch(set, {immediate: true, engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path);
				});

				expect(proxy.add(1)).toBe(proxy);
				expect(spy).toHaveBeenCalledWith(1, undefined, [1]);
				expect(set.has(1)).toBe(true);

				expect(proxy.add(2)).toBe(proxy);
				expect(spy).toHaveBeenCalledWith(2, undefined, [2]);
				expect(set.has(2)).toBe(true);

				expect(proxy.delete(2)).toBe(true);
				expect(spy).toHaveBeenCalledWith(undefined, 2, [2]);
				expect(set.has(2)).toBe(false);

				expect(proxy.clear()).toBeUndefined();
				expect(spy).toHaveBeenCalledWith(undefined, undefined, []);
				expect(set.has(1)).toBe(false);
			});

			it("watching for a set' iterator", () => {
				const
					key = {a: 1},
					set = new Set([key]),
					spy = jest.fn();

				const {proxy} = watch(set, {deep: true, immediate: true, engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path);
				});

				[...proxy][0].a++;
				expect(spy).toHaveBeenCalledWith(2, 1, [key, 'a']);
				expect(set).toEqual(new Set([{a: 2}]));

				[...proxy.values()][0].a++;
				expect(spy).toHaveBeenCalledWith(3, 2, [key, 'a']);
				expect(set).toEqual(new Set([{a: 3}]));

				[...proxy.entries()][0][1].a++;
				expect(spy).toHaveBeenCalledWith(4, 3, [key, 'a']);
				expect(set).toEqual(new Set([{a: 4}]));

				expect([...proxy.keys()].length).toBe(1);
			});

			it('watching for a weak set', () => {
				const
					set = new WeakSet([]),
					spy = jest.fn();

				const {proxy} = watch(set, {immediate: true, engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path);
				});

				const
					key1 = [];

				expect(proxy.add(key1)).toBe(proxy);
				expect(spy).toHaveBeenCalledWith(key1, undefined, [key1]);
				expect(set.has(key1)).toBe(true);

				const
					key2 = {};

				expect(proxy.add(key2)).toBe(proxy);
				expect(spy).toHaveBeenCalledWith(key2, undefined, [key2]);
				expect(set.has(key2)).toBe(true);

				expect(proxy.delete(key2)).toBe(true);
				expect(spy).toHaveBeenCalledWith(undefined, key2, [key2]);
				expect(set.has(key2)).toBe(false);
			});

			it('watching for a map', () => {
				const
					map = new Map([[0, 1], [1, 2]]),
					spy = jest.fn();

				const {proxy} = watch(map, {immediate: true, engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path);
				});

				expect(proxy.set(0, 2)).toBe(proxy);
				expect(spy).toHaveBeenCalledWith(2, 1, [0]);
				expect(map.get(0)).toBe(2);

				expect(proxy.set(5, 2)).toBe(proxy);
				expect(spy).toHaveBeenCalledWith(2, undefined, [5]);
				expect(map.get(5)).toBe(2);

				expect(proxy.delete(5)).toBe(true);
				expect(spy).toHaveBeenCalledWith(undefined, 2, [5]);
				expect(map.has(5)).toBe(false);

				expect(proxy.clear()).toBeUndefined();
				expect(spy).toHaveBeenCalledWith(undefined, undefined, []);
				expect(map.has(0)).toBe(false);
				expect(map.has(1)).toBe(false);
			});

			it("watching for a map' iterator", () => {
				const
					key = {b: 1},
					map = new Map([[key, {a: 1}]]),
					spy = jest.fn();

				const {proxy} = watch(map, {deep: true, immediate: true, engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path);
				});

				expect([...map]).toEqual([...new Map([[key, {a: 1}]])]);

				[...proxy][0][1].a++;
				expect(spy).toHaveBeenCalledWith(2, 1, [key, 'a']);
				expect(map).toEqual(new Map([[key, {a: 2}]]));

				[...proxy.values()][0].a++;
				expect(spy).toHaveBeenCalledWith(3, 2, [key, 'a']);
				expect(map).toEqual(new Map([[key, {a: 3}]]));

				[...proxy.entries()][0][1].a++;
				expect(spy).toHaveBeenCalledWith(4, 3, [key, 'a']);
				expect(map).toEqual(new Map([[key, {a: 4}]]));

				expect([...proxy.keys()].length).toBe(1);
			});

			it('watching for a weak map', () => {
				const
					map = new WeakMap([]),
					spy = jest.fn();

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

				expect(proxy.delete(key2)).toBe(true);
				expect(spy).toHaveBeenCalledWith(undefined, 23, [key2]);
				expect(map.has(key2)).toBe(false);
			});

			it('tying a watcher to another object', () => {
				const
					another = {},
					obj = {a: 1, b: 2},
					spy = jest.fn();

				watch(obj, {immediate: true, tiedWith: another, engine}, (value, oldValue) => {
					spy(value, oldValue);
				});

				another.a = 2;
				expect(spy).toHaveBeenCalledWith(2, 1);

				another.b = 4;
				expect(spy).toHaveBeenCalledWith(4, 2);
			});

			it('filtering of mutations', () => {
				const
					obj = {a: 1, b: 2},
					spy = jest.fn();

				const
					eventFilter = (value, oldValue, info) => info.path.join('.') === 'a';

				const {proxy} = watch(obj, {immediate: true, eventFilter, engine}, (value, oldValue) => {
					spy(value, oldValue);
				});

				proxy.b = 4;
				expect(spy).not.toHaveBeenCalled();

				proxy.a = 2;
				expect(spy).toHaveBeenCalledWith(2, 1);
			});

			it('modifying of mutations', () => {
				const
					obj = {a: 1, b: 2},
					spy = jest.fn();

				const
					pathModifier = (path) => path.join('.') === 'a' ? ['b'] : path;

				const {proxy} = watch(obj, {immediate: true, pathModifier, engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path);
				});

				proxy.a = 2;
				expect(spy).toHaveBeenCalledWith(2, 1, ['b']);

				proxy.b = 4;
				expect(spy).toHaveBeenCalledWith(4, 2, ['b']);
			});

			it('muting of mutations', () => {
				const
					obj = {a: 1, b: 2},
					spy = jest.fn();

				const {proxy} = watch(obj, {immediate: true, engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path);
				});

				mute(proxy);

				proxy.a = 2;
				expect(spy).not.toHaveBeenCalled();

				unmute(proxy);

				proxy.b = 4;
				expect(spy).toHaveBeenCalledWith(4, 2, ['b']);
			});

			it('marking a part of the watched object as unwatchable', () => {
				const
					obj = {a: 1, b: unwatchable({c: 2, d: {e: 3}}, engine)},
					spy = jest.fn();

				const {proxy, set} = watch(obj, {immediate: true, engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path);
				});

				proxy.b.c = 3;
				proxy.b.d.e = 4;

				set('b.e', 6);

				expect(spy).not.toHaveBeenCalled();

				proxy.a = 2;

				expect(spy).toHaveBeenCalled();
			});

			it('canceling of watching', () => {
				const
					obj = {a: 1, b: 2},
					spy = jest.fn();

				const {proxy, unwatch} = watch(obj, {immediate: true, engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path);
				});

				unwatch();

				proxy.a = 2;
				expect(spy).not.toHaveBeenCalled();
			});

			it('setting of new properties', () => {
				{
					const
						obj = {},
						spy = jest.fn();

					const {proxy, set} = watch(obj, {immediate: true, engine}, (value, oldValue, info) => {
						spy(value, oldValue, info.path);
					});

					set('a', 1);
					expect(spy).toHaveBeenCalledWith(1, undefined, ['a']);

					proxy.a = 2;
					expect(spy).toHaveBeenCalledWith(2, 1, ['a']);
				}

				{
					const
						obj = {},
						spy = jest.fn();

					const {proxy} = watch(obj, {immediate: true, engine}, (value, oldValue, info) => {
						spy(value, oldValue, info.path);
					});

					set(proxy, 'a', 1, engine);
					expect(spy).toHaveBeenCalledWith(1, undefined, ['a']);

					proxy.a = 2;
					expect(spy).toHaveBeenCalledWith(2, 1, ['a']);
				}
			});

			it('deep setting of new properties', () => {
				{
					const
						obj = {},
						spy = jest.fn();

					const {proxy, set} = watch(obj, {immediate: true, engine, deep: true}, (value, oldValue, info) => {
						spy(value, oldValue, info.path);
					});

					set('a.b', 1);
					expect(spy).toHaveBeenCalledWith(1, undefined, ['a', 'b']);
					expect(proxy.a?.b).toBe(1);
					expect(obj.a?.b).toBe(1);

					proxy.a.b = 2;
					expect(spy).toHaveBeenCalledWith(2, 1, ['a', 'b']);
					expect(proxy.a?.b).toBe(2);
					expect(obj.a?.b).toBe(2);
				}

				{
					const
						obj = {},
						spy = jest.fn();

					const {proxy} = watch(obj, {immediate: true, engine, deep: true}, (value, oldValue, info) => {
						spy(value, oldValue, info.path);
					});

					set(proxy, 'a.b', 1, engine);
					expect(spy).toHaveBeenCalledWith(1, undefined, ['a', 'b']);
					expect(proxy.a?.b).toBe(1);
					expect(obj.a?.b).toBe(1);

					proxy.a.b = 2;
					expect(spy).toHaveBeenCalledWith(2, 1, ['a', 'b']);
					expect(proxy.a?.b).toBe(2);
					expect(obj.a?.b).toBe(2);
				}
			});

			it('deleting of properties', () => {
				{
					const
						obj = {a: 1},
						spy = jest.fn();

					const {proxy} = watch(obj, {immediate: true, engine}, (value, oldValue, info) => {
						spy(value, info.path);
					});

					delete proxy.a;
					expect(spy).not.toHaveBeenCalled();

					proxy.a = 2;
					expect(spy).not.toHaveBeenCalled();

					set(proxy, 'a', 1, engine);
					expect(spy).toHaveBeenCalledWith(1, ['a']);
				}

				{
					const
						obj = {a: 1},
						spy = jest.fn();

					const watcher = watch(obj, {immediate: true, deep: true, engine}, (value, oldValue, info) => {
						spy(value, oldValue, info.path);
					});

					watcher.delete('a');
					expect(spy).toHaveBeenCalledWith(undefined, 1, ['a']);

					watcher.proxy.a = 2;
					expect(spy).not.toHaveBeenCalledWith(2, undefined, ['a']);

					watcher.set('a', 3);
					expect(spy).toHaveBeenCalledWith(3, 2, ['a']);

					watcher.set('b.c', 3);
					expect(spy).toHaveBeenCalledWith(3, undefined, ['b', 'c']);
				}

				{
					const
						obj = {a: 1},
						spy = jest.fn();

					const {proxy} = watch(obj, {immediate: true, engine}, (value, oldValue, info) => {
						spy(value, oldValue, info.path);
					});

					unset(proxy, 'a', engine);
					expect(spy).toHaveBeenCalledWith(undefined, 1, ['a']);

					proxy.a = 2;
					expect(spy).not.toHaveBeenCalledWith(2, undefined, ['a']);

					set(proxy, 'a', 3, engine);
					expect(spy).toHaveBeenCalledWith(3, 2, ['a']);
				}
			});

			it('modifying prototype values', () => {
				const
					obj = {a: {a: 1}, __proto__: {b: {b: 1}}},
					spy = jest.fn();

				const {proxy} = watch(obj, {deep: true, immediate: true, withProto: true, engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path);
				});

				proxy.b.b++;
				expect(spy).toHaveBeenCalledWith(2, 1, ['b', 'b']);

				proxy.a.a++;
				expect(spy).toHaveBeenCalledWith(2, 1, ['a', 'a']);

				expect(proxy.b.b).toBe(2);
				expect(proxy.a.a).toBe(2);
			});

			it('isProxy', () => {
				expect(isProxy(watch({}, {immediate: true, engine}).proxy)).toBe(true);
				expect(isProxy(null)).toBe(false);
				expect(isProxy({})).toBe(false);
			});

			if (engineName === 'proxy') {
				it("shouldn't wrap readonly non-configurable properties", () => {
					const
						obj = {},
						nested = {a: 1};

					Object.defineProperty(obj, 'foo', {
						value: nested
					});

					const {proxy} = watch(obj, {deep: true, engine});
					expect(proxy.foo).toBe(nested);
				});

				it('should watch properties added via `Object.defineProperty`', () => {
					const
						obj = {},
						spy = jest.fn();

					const {proxy} = watch(obj, {immediate: true, engine}, (value, oldValue, info) => {
						spy(value, oldValue, info.path);
					});

					Object.defineProperty(proxy, 'bla', {
						enumerable: true,
						value: 10
					});

					expect(spy).toHaveBeenCalledWith(10, undefined, ['bla']);

					expect(Object.getOwnPropertyDescriptor(proxy, 'bla')).toEqual({
						configurable: false,
						writable: false,
						enumerable: true,
						value: 10
					});
				});
			}
		});
	});
});
