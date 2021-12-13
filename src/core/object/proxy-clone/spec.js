/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import proxyClone from 'core/object/proxy-clone';

describe('core/object/proxy-clone', () => {
	it('cloning an object', () => {
		const original = {
			user: {
				name: 'Bob',
				age: 56,
				skills: ['singing', 'dancing', 'programming']
			}
		};

		const
			clone = proxyClone(original);

		clone.user.name = 'Jack';
		clone.user.skills.push('boxing');

		expect(clone.user.name).toBe('Jack');
		expect(original.user.name).toBe('Bob');

		expect(clone.user.skills).toEqual(['singing', 'dancing', 'programming', 'boxing']);
		expect(original.user.skills).toEqual(['singing', 'dancing', 'programming']);

		delete clone.user.name;

		expect(clone.user.name).toBe(undefined);
		expect('name' in clone.user).toBeFalse();

		expect(original.user.name).toBe('Bob');
	});

	it('getting `Object.keys` from the clone object', () => {
		const original = {
			a: 1,
			b: [1, 2, 3]
		};

		const
			clone = proxyClone(original);

		delete clone.a;
		clone.c = 10;

		expect(Object.keys(clone)).toEqual(['b', 'c']);

		clone.b.push(4);
		expect(Object.keys(clone.b)).toEqual(['0', '1', '2', '3']);
	});

	it('cloning an object with accessors', () => {
		const original = {
			user: {
				get name() {
					return 'Bob';
				},

				_age: 56,

				get age() {
					return this._age;
				},

				set age(value) {
					this._age = value * 2;
				}
			}
		};

		const
			clone = proxyClone(original);

		expect(() => clone.user.name = 'Jack')
			.toThrowError("'set' on proxy: trap returned falsish for property 'name'");

		clone.user.age = 5;

		expect(clone.user.age).toBe(10);
		expect(original.user.age).toBe(56);

		delete clone.user.name;

		expect(clone.user.name).toBe(undefined);
		expect('name' in clone.user).toBeFalse();

		expect(original.user.name).toBe('Bob');
	});

	it('cloning an object with descriptors', () => {
		const original = {
			user: {
				name: 'Bob'
			}
		};

		const
			clone = proxyClone(original);

		Object.defineProperty(original.user, 'age', {
			configurable: true,
			value: 56
		});

		expect(Object.getOwnPropertyDescriptor(clone.user, 'age')).toEqual({
			value: 56,
			writable: false,
			enumerable: false,
			configurable: true
		});

		expect(() => clone.user.age = 12)
			.toThrowError("'set' on proxy: trap returned falsish for property 'age'");

		Object.defineProperty(clone.user, 'age', {
			writable: true,
			enumerable: true,
			configurable: true,
			value: 17
		});

		expect(clone.user.age).toBe(17);

		expect(Object.getOwnPropertyDescriptor(clone.user, 'age')).toEqual({
			value: 17,
			writable: true,
			enumerable: true,
			configurable: true
		});

		Object.defineProperty(clone, 'bla', {
			enumerable: true,
			get() {
				return 10;
			}
		});

		expect(clone.bla).toBe(10);

		Object.defineProperty(original.user, 'newAge', {
			writable: true,
			value: 56
		});

		expect(() => {
			delete clone.user.newAge;
		}).toThrowError("'deleteProperty' on proxy: trap returned falsish for property 'newAge'");

		Object.defineProperty(clone.user, 'newAge', {
			value: 46
		});

		expect(clone.user.newAge).toBe(46);

		expect(Object.getOwnPropertyDescriptor(clone.user, 'newAge')).toEqual({
			value: 46,
			writable: true,
			enumerable: false,
			configurable: false
		});
	});

	it('cloning an array', () => {
		const original = [
			{
				name: 'Bob',
				age: 56,
				skills: ['singing', 'dancing', 'programming']
			}
		];

		const
			clone = proxyClone(original);

		clone[0].name = 'Jack';
		clone[0].skills.push('boxing');

		clone.push({
			name: 'Sam',
			age: 23
		});

		expect(clone[0].name).toBe('Jack');
		expect(original[0].name).toBe('Bob');

		expect(clone[0].skills).toEqual(['singing', 'dancing', 'programming', 'boxing']);
		expect(original[0].skills).toEqual(['singing', 'dancing', 'programming']);

		expect(clone).toEqual([
			{
				name: 'Jack',
				age: 56,
				skills: ['singing', 'dancing', 'programming', 'boxing']
			},

			{
				name: 'Sam',
				age: 23
			}
		]);

		expect(original).toEqual([
			{
				name: 'Bob',
				age: 56,
				skills: ['singing', 'dancing', 'programming']
			}
		]);
	});

	it('cloning an object with Map/Set properties', () => {
		const original = new Map([
			[
				'user',

				{
					name: 'Bob',
					age: 56,
					skills: new Set(['singing', 'dancing', 'programming'])
				}
			]
		]);

		const
			clone = proxyClone(original);

		clone.get('user').name = 'Jack';
		clone.get('user').skills.add('boxing');

		expect(clone.get('user').name).toBe('Jack');
		expect(original.get('user').name).toBe('Bob');

		expect(clone.get('user').skills).toBeInstanceOf(Set);
		expect([...clone.get('user').skills]).toEqual(['singing', 'dancing', 'programming', 'boxing']);
		expect([...original.get('user').skills]).toEqual(['singing', 'dancing', 'programming']);
	});

	it('cloning an object with WeakMap/WeakSet properties', () => {
		const
			user = {},
			singing = {},
			dancing = {},
			programming = {},
			boxing = {};

		const original = new WeakMap([
			[
				user,

				{
					name: 'Bob',
					age: 56,
					skills: new WeakSet([singing, dancing, programming])
				}
			]
		]);

		const
			clone = proxyClone(original);

		clone.get(user).name = 'Jack';
		clone.get(user).skills.add(boxing);

		expect(clone.get(user).name).toBe('Jack');
		expect(original.get(user).name).toBe('Bob');

		expect(clone.get(user).skills).toBeInstanceOf(WeakSet);
		expect(clone.get(user).skills.has(boxing)).toBeTrue();
		expect(original.get(user).skills.has(boxing)).toBeFalse();
	});

	it('cloning an iterable object', () => {
		const original = new Map([
			[
				'user',

				{
					name: 'Bob',
					age: 56,
					skills: [{type: 'singing'}, {type: 'dancing'}],
					skillsSet: [{type: 'singing'}, {type: 'dancing'}]
				}
			]
		]);

		const
			clone = proxyClone(original);

		for (const el of clone.get('user').skills) {
			el.type = [...el.type].reverse().join('');
		}

		expect([...clone.get('user').skills]).toEqual([
			{type: 'gnignis'},
			{type: 'gnicnad'}
		]);

		expect([...original.get('user').skills]).toEqual([
			{type: 'singing'},
			{type: 'dancing'}
		]);

		for (const el of clone.get('user').skillsSet) {
			el.type = [...el.type].reverse().join('');
		}

		expect([...clone.get('user').skillsSet]).toEqual([
			{type: 'gnignis'},
			{type: 'gnicnad'}
		]);

		expect([...original.get('user').skillsSet]).toEqual([
			{type: 'singing'},
			{type: 'dancing'}
		]);
	});
});
