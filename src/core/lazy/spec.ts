/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import makeLazy from 'core/lazy';

describe('core/lazy', () => {
	it('should create a structure based on the passed function', () => {
		const
			scan: string[] = [];

		function createObj(a: number) {
			return {
				a,
				bla(...args: string[]) {
					scan.push(...args);
				}
			};
		}

		const lazyObj = makeLazy(createObj, {
			a: 2,
			bla: Function
		});

		lazyObj.a++;
		lazyObj.bla('bla', 'bar');
		lazyObj.bla('baz');

		const
			obj = lazyObj(2);

		expect(obj.a).toBe(3);
		expect(scan).toEqual(['bla', 'bar', 'baz']);
	});

	it('should create a structure based on the passed class', () => {
		const
			scan: string[] = [];

		class User {
			name: string;
			age: number;

			config: {attr?: string; errorHandler(): void} = {
					errorHandler() {
					scan.push('errorHandler');
				}
			};

			constructor(name: string, age: number) {
				this.name = name;
				this.age = age;
			}

			sayName() {
				scan.push('sayName');
			}
		}

		const LazyUser = makeLazy(User, {
			config: {
				attr: {},
				errorHandler: Function
			}
		});

		LazyUser.sayName();

		LazyUser.config.attr = 'value';
		LazyUser.config.errorHandler();

		const
			user = new LazyUser('Bob', 23);

		expect(user.name).toBe('Bob');
		expect(user.age).toBe(23);
		expect(user.config.attr).toBe('value');

		expect(scan).toEqual(['sayName', 'errorHandler']);
	});

	it('creating two instances of the one lazy structure based on a class', () => {
		const
			scan: string[] = [];

		class User {
			name: string;
			age: number;

			config: Dictionary = {
				errorHandler() {
					scan.push('errorHandler');
				}
			};

			constructor(name: string, age: number) {
				this.name = name;
				this.age = age;
			}

			sayName() {
				scan.push('sayName');
			}
		}

		const LazyUser = makeLazy(User, {
			config: {
				attr: {},
				errorHandler: Function
			}
		});

		LazyUser.sayName();
		LazyUser.config = {foo: 'bar'};

		const
			user1 = new LazyUser('Bob', 23);

		expect(user1.config).toEqual({foo: 'bar'});
		expect(scan).toEqual(['sayName']);

		LazyUser.config.attr = 'value';

		const
			user2 = new LazyUser('Bob', 23);

		expect(user2.config.attr).toBe('value');
		expect(scan).toEqual(['sayName', 'sayName']);
	});

	it('creating two instances of the one lazy structure based on a class', () => {
		const
			cache = {};

		class RenderEngine {
			config: {attr: Dictionary | string; errorHandler(): void} = {
				attr: {},
				errorHandler: Function
			};

			component(name: string, opts?: Dictionary) {
				if (opts == null) {
					return cache[name];
				}

				cache[name] = opts;
				return true;
			}
		}

		const LazyRenderEngine = makeLazy(
			RenderEngine,

			{
				config: {
					attr: {},
					errorHandler: Function
				}
			},

			{
				get: {
					'config.attrs'(contexts: RenderEngine[]) {
						return contexts.at(-1)?.config.attr;
					}
				},

				set: {
					'config.attrs'(contexts: RenderEngine[], value: unknown) {
						contexts.forEach((ctx) => {
							ctx.config.attr = <string>value;
						});
					}
				},

				call: {
					component(contexts: RenderEngine[], ...args: unknown[]) {
						if (args.length > 1) {
							contexts.forEach((ctx) => {
								ctx.component(<string>args[0], <Dictionary>args[1]);
							});

							return true;
						}

						return contexts.at(-1)?.component(<string>args[0]);
					}
				}
			}
		);

		const
			engine1 = new LazyRenderEngine(),
			engine2 = new LazyRenderEngine();

		LazyRenderEngine.config.attr = 'value';
		expect(LazyRenderEngine.config.attr).toBe('value');

		const newAwesomeComponent = {
			props: {
				a: String,
				b: Number
			},

			render: () => ({})
		};

		expect(LazyRenderEngine.component('newAwesomeComponent', newAwesomeComponent)).toBe(true);
		expect(LazyRenderEngine.component('newAwesomeComponent')).toBe(newAwesomeComponent);

		expect(engine1.component('newAwesomeComponent')).toBe(newAwesomeComponent);
		expect(engine2.component('newAwesomeComponent')).toBe(newAwesomeComponent);
	});
});
