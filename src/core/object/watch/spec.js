/* eslint-disable max-lines-per-function */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import watch, { mute, unmute, set, unset, isProxy } from 'core/object/watch';

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

		it(`lazy watching for an object (${type})`, (done) => {
			const
				obj = {a: 1, b: 2},
				spy = jasmine.createSpy();

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

		it(`lazy watching for an object with collapsing (${type})`, (done) => {
			const
				obj = {a: 1, b: 2},
				spy = jasmine.createSpy();

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

		it(`deep watching for an object (${type})`, () => {
			const
				obj = {a: {b: [], c: {e: 1}}},
				spy = jasmine.createSpy();

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

		it(`deep watching for an object by a complex path (${type})`, () => {
			const
				obj = {a: {b: []}, c: {e: 1}};

			{
				const
					spy = jasmine.createSpy();

				const {proxy} = watch(obj, 'a.b', {immediate: true, engine}, (value, oldValue) => {
					spy(value, oldValue);
				});

				proxy.a.b = [1, 2, 3];
				expect(spy).toHaveBeenCalledWith([1, 2, 3], []);
			}

			{
				const
					spy = jasmine.createSpy();

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

		it(`isolated watchers (${type})`, () => {
			const
				obj = {a: {b: [], c: {e: 1}}},
				spy1 = jasmine.createSpy('spy1'),
				spy2 = jasmine.createSpy('spy2');

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

		it(`shared watchers (${type})`, () => {
			const
				obj = {a: {b: [], c: {e: 1}}},
				spy1 = jasmine.createSpy('spy1'),
				spy2 = jasmine.createSpy('spy2');

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

		it(`deep watching for an object with the prototype (${type})`, () => {
			const
				obj = {a: {b: [], __proto__: {c: {e: 1}}}},
				protoSpy = jasmine.createSpy('with the prototype'),
				nonProtoSpy = jasmine.createSpy('without the prototype');

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

		it(`deep watching with collapsing (${type})`, () => {
			const
				obj = {a: {b: [], c: {e: 1}}, c: []},
				spy = jasmine.createSpy();

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

		it(`lazy deep watching with collapsing (${type})`, (done) => {
			const
				obj = {a: {b: [], c: {e: 1}}, c: []},
				spy = jasmine.createSpy();

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

		it(`watching for getters with prefixes and postfixes (${type})`, () => {
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
				spy = jasmine.createSpy('global'),
				localSpy = jasmine.createSpy('local');

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

		it(`watching for getters with dependencies (${type})`, () => {
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
					spy = jasmine.createSpy('global'),
					localSpy = jasmine.createSpy('local');

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

		it(`watching for the particular getter with dependencies (${type})`, () => {
			const obj = {
				_a: 1,

				get a() {
					return this._a * 2;
				}
			};

			const
				spy = jasmine.createSpy('global');

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

		it(`ties watcher with another object (${type})`, () => {
			const
				another = {},
				obj = {a: 1, b: 2},
				spy = jasmine.createSpy();

			watch(obj, {immediate: true, tiedWith: another, engine}, (value, oldValue) => {
				spy(value, oldValue);
			});

			another.a = 2;
			expect(spy).toHaveBeenCalledWith(2, 1);

			another.b = 4;
			expect(spy).toHaveBeenCalledWith(4, 2);
		});

		it(`filtering of mutations (${type})`, () => {
			const
				obj = {a: 1, b: 2},
				spy = jasmine.createSpy();

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

		it(`modifying of mutations (${type})`, () => {
			const
				obj = {a: 1, b: 2},
				spy = jasmine.createSpy();

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

		it(`muting of mutations (${type})`, () => {
			const
				obj = {a: 1, b: 2},
				spy = jasmine.createSpy();

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

		it(`cancels watching (${type})`, () => {
			const
				obj = {a: 1, b: 2},
				spy = jasmine.createSpy();

			const {proxy, unwatch} = watch(obj, {immediate: true, engine}, (value, oldValue, info) => {
				spy(value, oldValue, info.path);
			});

			unwatch();

			proxy.a = 2;
			expect(spy).not.toHaveBeenCalled();
		});

		it(`setting of new properties (${type})`, () => {
			{
				const
					obj = {},
					spy = jasmine.createSpy();

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
					spy = jasmine.createSpy();

				const {proxy} = watch(obj, {immediate: true, engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path);
				});

				set(proxy, 'a', 1, engine);
				expect(spy).toHaveBeenCalledWith(1, undefined, ['a']);

				proxy.a = 2;
				expect(spy).toHaveBeenCalledWith(2, 1, ['a']);
			}
		});

		it(`deleting of properties (${type})`, () => {
			{
				const
					obj = {},
					spy = jasmine.createSpy();

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
					obj = {},
					spy = jasmine.createSpy();

				const watcher = watch(obj, {immediate: true, engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path);
				});

				watcher.delete('a');
				expect(spy).not.toHaveBeenCalled();

				watcher.proxy.a = 2;
				expect(spy).toHaveBeenCalledWith(2, undefined, ['a']);
			}

			{
				const
					obj = {},
					spy = jasmine.createSpy();

				const {proxy} = watch(obj, {immediate: true, engine}, (value, oldValue, info) => {
					spy(value, oldValue, info.path);
				});

				unset(proxy, 'a', engine);
				expect(spy).not.toHaveBeenCalled();

				proxy.a = 2;
				expect(spy).toHaveBeenCalledWith(2, undefined, ['a']);
			}
		});

		it(`isProxy (${type})`, () => {
			expect(isProxy(watch({}, {immediate: true, engine}).proxy)).toBeTrue();
			expect(isProxy(null)).toBeFalse();
			expect(isProxy({})).toBeFalse();
		});
	});
});
