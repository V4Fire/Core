/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import {

	local,
	session,
	asyncLocal,
	asyncSession,
	factory

} from 'core/kv-storage';

// eslint-disable-next-line import/extensions
import * as IDBEngine from 'core/kv-storage/engines/fake-indexeddb';

const kv = {
	local,
	session,
	asyncLocal,
	asyncSession,
	IDBSession: factory(IDBEngine.syncSessionStorage),
	asyncIDBLocal: factory(IDBEngine.asyncLocalStorage, true),
	asyncIDBSession: factory(IDBEngine.asyncSessionStorage, true)
};

describe('core/kv-storage', () => {
	const getNms = () => {
		const prfx = Math.random().toString(16);
		return (name) => `${prfx}_${name}`;
	};

	['local', 'session', 'IDBSession'].forEach((method) => {
		const
			api = kv[method];

		it(`synchronous "${method}" crud`, () => {
			const
				getKey = getNms();

			api.set(getKey('foo'), 1);
			expect(api.has(getKey('foo'))).toBeTrue();
			expect(api.get(getKey('foo'))).toBe(1);

			api.set(getKey('foo'), true);
			expect(api.has(getKey('foo'))).toBeTrue();
			expect(api.get(getKey('foo'))).toBe(true);

			api.set(getKey('foo'), [2, 3]);
			expect(api.has(getKey('foo'))).toBeTrue();
			expect(api.get(getKey('foo'))).toEqual([2, 3]);

			api.remove(getKey('foo'));
			expect(api.has(getKey('foo'))).toBeFalse();
		});

		it(`synchronous "${method}" clear with a filter`, () => {
			const
				getKey = getNms();

			api.set(getKey('foo'), 1);
			api.set(getKey('bar'), 2);

			expect(api.has(getKey('foo'))).toBeTrue();
			expect(api.has(getKey('bar'))).toBeTrue();

			api.clear((el, key) => key === getKey('bar'));

			expect(api.has(getKey('foo'))).toBeTrue();
			expect(api.has(getKey('bar'))).toBeFalse();

			api.remove(getKey('foo'));
		});

		{
			const
				getKey = getNms(),
				nms = api.namespace(getKey('custom namespace'));

			it(`namespaced synchronous "${method}" crud`, () => {
				nms.set('foo', 1);
				expect(nms.has('foo')).toBeTrue();
				expect(nms.get('foo')).toBe(1);

				nms.set('foo', true);
				expect(nms.has('foo')).toBeTrue();
				expect(nms.get('foo')).toBe(true);

				nms.set('foo', [2, 3]);
				expect(nms.has('foo')).toBeTrue();
				expect(nms.get('foo')).toEqual([2, 3]);

				nms.remove('foo');
				expect(nms.has('foo')).toBeFalse();
			});

			it(`namespaced synchronous "${method}" clear`, () => {
				nms.set('foo', 1);
				nms.set('bar', 2);

				expect(nms.has('foo')).toBeTrue();
				expect(nms.has('bar')).toBeTrue();

				nms.clear();

				expect(nms.has('foo')).toBeFalse();
				expect(nms.has('bar')).toBeFalse();
			});

			it(`namespaced synchronous "${method}" clear with a filter`, () => {
				nms.set('foo', 1);
				nms.set('bar', 'boom');

				expect(nms.has('foo')).toBeTrue();
				expect(nms.has('bar')).toBeTrue();

				nms.clear((el) => el === 'boom');

				expect(nms.has('foo')).toBeTrue();
				expect(nms.has('bar')).toBeFalse();

				api.remove(getKey('foo'));
			});
		}
	});

	['asyncLocal', 'asyncSession', 'asyncIDBLocal', 'asyncIDBSession'].forEach((method) => {
		const
			api = kv[method];

		it(`asynchronous "${method}" crud`, async () => {
			const
				getKey = getNms();

			await api.set(getKey('foo'), 1);
			expect(await api.has(getKey('foo'))).toBeTrue();
			expect(await api.get(getKey('foo'))).toBe(1);

			await api.set(getKey('foo'), true);
			expect(await api.has(getKey('foo'))).toBeTrue();
			expect(await api.get(getKey('foo'))).toBe(true);

			await api.set(getKey('foo'), [2, 3]);
			expect(await api.has(getKey('foo'))).toBeTrue();
			expect(await api.get(getKey('foo'))).toEqual([2, 3]);

			await api.remove(getKey('foo'));
			expect(await api.has(getKey('foo'))).toBeFalse();
		});

		it(`asynchronous "${method}" clear with a filter`, async () => {
			const
				getKey = getNms();

			await api.set(getKey('foo'), 1);
			await api.set(getKey('bar'), 2);

			expect(await api.has(getKey('foo'))).toBeTrue();
			expect(await api.has(getKey('bar'))).toBeTrue();

			await api.clear((el, key) => key === getKey('bar'));

			expect(await api.has(getKey('foo'))).toBeTrue();
			expect(await api.has(getKey('bar'))).toBeFalse();

			api.remove(getKey('foo'));
		});

		{
			const
				getKey = getNms(),
				nms = api.namespace(getKey('custom namespace'));

			it(`namespaced asynchronous "${method}" crud`, async () => {
				await nms.set('foo', 1);
				expect(await nms.has('foo')).toBeTrue();
				expect(await nms.get('foo')).toBe(1);

				await nms.set('foo', true);
				expect(await nms.has('foo')).toBeTrue();
				expect(await nms.get('foo')).toBe(true);

				await nms.set('foo', [2, 3]);
				expect(await nms.has('foo')).toBeTrue();
				expect(await nms.get('foo')).toEqual([2, 3]);

				await nms.remove('foo');
				expect(await nms.has('foo')).toBeFalse();
			});

			it(`namespaced asynchronous "${method}" clear`, async () => {
				await nms.set('foo', 1);
				await nms.set('bar', 2);

				expect(await nms.has('foo')).toBeTrue();
				expect(await nms.has('bar')).toBeTrue();

				await nms.clear();

				expect(await nms.has('foo')).toBeFalse();
				expect(await nms.has('bar')).toBeFalse();
			});

			it(`namespaced asynchronous "${method}" clear with a filter`, async () => {
				await nms.set('foo', 1);
				await nms.set('bar', 'boom');

				expect(await nms.has('foo')).toBeTrue();
				expect(await nms.has('bar')).toBeTrue();

				await nms.clear((el) => el === 'boom');

				expect(await nms.has('foo')).toBeTrue();
				expect(await nms.has('bar')).toBeFalse();

				api.remove(getKey('foo'));
			});
		}
	});
});
