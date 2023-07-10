/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import StringEngine from 'core/kv-storage/engines/string';
import { defaultDataSeparators as separators } from 'core/kv-storage/engines/string/const';

import * as kv from 'core/kv-storage';

describe('kv-storage/engines/string', () => {
	const
		initValue = `foo${separators.record}true${separators.chunk}bar${separators.record}baz`,
		engine = new StringEngine({data: initValue, separators}),
		storage = kv.factory(engine);

	it('`the storage must have access to the initial values`', () => {
		expect(engine.serializedData).toBe(initValue);
		expect(storage.get('foo')).toBe(true);
		expect(storage.get('bar')).toBe('baz');
	});

	it('`deleting a value should remove it from the string`', () => {
		storage.remove('bar');
		expect(engine.serializedData).toBe(`foo${separators.record}true`);
		expect(storage.get('bar')).toBe(undefined);
	});

	it('`adding a new value should save it to a string`', () => {
		storage.set('test', 'value');
		expect(engine.serializedData).toBe(`foo${separators.record}true${separators.chunk}test${separators.record}"value"`);
		storage.get('test').toBe('value');
	});

	it('`сlearing the storage, should clear the string`', () => {
		storage.clear();
		expect(engine.serializedData).toBe('');
	});
});
