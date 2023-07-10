/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as kv from 'core/kv-storage';

import StringEngine from 'core/kv-storage/engines/string';
import { defaultDataSeparators as separators } from 'core/kv-storage/engines/string/const';

describe('kv-storage/engines/string', () => {
	let
		storage: kv.SyncStorage,
		engine: StringEngine;

	beforeEach(() => {
		engine = new StringEngine();
		storage = kv.factory(engine);
	});

	it('the storage can be initialized with data', () => {
		const
			initialData = `foo${separators.record}true${separators.chunk}bar${separators.record}baz`;

		const
			engine = new StringEngine({data: initialData}),
			storage = kv.factory(engine);

		expect(engine.serializedData).toBe(initialData);
		expect(storage.get('foo')).toBe(true);
		expect(storage.get('bar')).toBe('baz');
	});

	it('removing a value should delete it from the string', () => {
		storage.set('foo', true);
		storage.set('bar', 1);

		expect(engine.serializedData).toBe(`foo${separators.record}true${separators.chunk}bar${separators.record}1`);

		storage.remove('bar');

		expect(engine.serializedData).toBe(`foo${separators.record}true`);
		expect(storage.get('bar')).toBe(undefined);
	});

	it('getting all keys stored in the storage', () => {
		engine.set('a', '1');
		engine.set('b', '2');
		engine.set('c', '3');

		expect(engine.keys()).toEqual(['a', 'b', 'c']);
	});

	it('adding a new value should save it to the string', () => {
		storage.set('foo', 'some value');

		expect(engine.serializedData).toBe(`foo${separators.record}"some value"`);
		expect(storage.get('foo')).toBe('some value');

		storage.set('bar', [1, 2, 3]);

		expect(engine.serializedData).toBe(`foo${separators.record}"some value"${separators.chunk}bar${separators.record}[1,2,3]`);
		expect(storage.get('bar')).toEqual([1, 2, 3]);
	});

	it('clearing the storage should clear the string', () => {
		storage.set('foo', true);
		storage.set('bar', 1);
		storage.clear();

		expect(engine.serializedData).toBe('');
	});

	it(
		'clearing the storage with passing a function should only clear those values for which the filter returned true',

		() => {
			storage.set('foo', true);
			storage.set('bar', 1);
			storage.set('baz', 2);

			storage.clear((el) => Object.isNumber(el));
			expect(engine.serializedData).toBe(`foo${separators.record}true`);

			storage.clear((el, key) => key === 'foo');
			expect(engine.serializedData).toBe('');
		}
	);

	it('using non-standard separators', () => {
		const
			engine = new StringEngine({separators: {record: '=', chunk: ';'}}),
			storage = kv.factory(engine);

		storage.set('foo', 1);
		storage.set('bar', true);

		expect(engine.serializedData).toBe('foo=1;bar=true');
	});
});
