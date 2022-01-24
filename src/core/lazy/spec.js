/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import makeLazy from 'core/lazy';

describe('core/lazy', () => {
	it('wraps a function', () => {
		const scan = [];

		function createObj(a) {
			return {
				a,
				bla(...args) {
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

		const obj = lazyObj(2);

		expect(obj.a).toBe(3);
		expect(scan).toEqual(['bla', 'bar', 'baz']);
	});

	it('wraps a class', () => {
		const scan = [];

		class User {
			constructor(name, age) {
				this.name = name;
				this.age = age;

				this.config = {
					errorHandler() {
						scan.push('errorHandler');
					}
				};
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

		const user = new LazyUser('Bob', 23);

		expect(user.name).toBe('Bob');
		expect(user.age).toBe(23);
		expect(user.config.attr).toBe('value');

		expect(scan).toEqual(['sayName', 'errorHandler']);
	});

	it('wraps a class and creates two instances', () => {
		const scan = [];

		class User {
			constructor(name, age) {
				this.name = name;
				this.age = age;

				this.config = {
					errorHandler() {
						scan.push('errorHandler');
					}
				};
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
});
