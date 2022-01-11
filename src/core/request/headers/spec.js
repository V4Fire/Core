/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { set, get } from 'core/env';
import Headers from 'core/request/headers';

fdescribe('core/request/headers', () => {
	let
		logOptions,
		arrHeaders,
		arrHeadersCopy;

	beforeAll(async () => {
		arrHeaders = [
			['header-1', 'value-1'],
			['header-2', 'value-1, value-2'],
			['header-3', 'value-1, value-2, value-3']
		];

		arrHeadersCopy = arrHeaders.map((pair) => [...pair]);

		logOptions = await get('log');
		set('log', {patterns: []});
	});

	afterAll(() => {
		set('log', logOptions);
	});

	describe('constructor takes initial headers', () => {
		it('as dictionary', () => {
			const
				dict = Object.fromEntries(arrHeaders),
				init = {...dict},
				headers = new Headers(init);

			expect(Object.fromEntries(headers.headers)).toEqual(dict);
		});

		it('as array', () => {
			const
				headers = new Headers(arrHeadersCopy);

			expect([...headers.headers]).toEqual(arrHeaders);
		});

		it('as another Headers instance', () => {
			const
				initHeaders = new Headers(arrHeadersCopy),
				headers = new Headers(initHeaders);

			expect([...headers.headers]).toEqual(arrHeaders);
		});
	});

	describe('instance of Header class is iterable', () => {
		it('allowing to go through all key-value pairs of headers', () => {
			const
				headers = new Headers(arrHeadersCopy);

			expect([...headers]).toEqual(arrHeaders);
		});
	});

	describe('"append" method', () => {
		it('appends a new value onto an existing header', () => {
			const
				headers = new Headers(arrHeaders);

			headers.append('header-1', 'value-2');

			expect(headers.headers.get('header-1')).toBe('value-1, value-2');
		});

		it('adds the header if it does not already exist', () => {
			const
				headers = new Headers();

			headers.append('header', 'value');

			expect(headers.headers.get('header')).toBe('value');
		});
	});

	describe('"delete" method', () => {
		it('deletes a header with a given name', () => {
			const
				headers = new Headers(arrHeaders);

			headers.delete('header-2');

			expect(headers.headers.has('header-1')).toBeTrue();
			expect(headers.headers.has('header-2')).toBeFalse();
		});
	});

	describe('"entries" method', () => {
		it('returns an iterator allowing to go through all key-value pairs of headers', () => {
			const
				headers = new Headers(arrHeadersCopy),
				iter = headers.entries();

			expect([...iter]).toEqual(arrHeaders);
		});
	});

	describe('"forEach" method', () => {
		it('executes a provided function once for each header', () => {
			const
				headers = new Headers(arrHeadersCopy),
				arr = [];

			headers.forEach((value, key) => {
				arr.push([key, value]);
			});

			expect(arr).toEqual(arrHeaders);
		});
	});

	describe('"get" method', () => {
		it('returns a String sequence of all the values of a header with a given name', () => {
			const
				headers = new Headers(arrHeaders),
				valueOfHeader1 = headers.get('header-1'),
				valueOfHeader2 = headers.get('header-2');

			expect(valueOfHeader1).toEqual('value-1');
			expect(valueOfHeader2).toEqual('value-1, value-2');
		});

		it('if the requested header doesn\'t exist in this object, it returns null', () => {
			const
				headers = new Headers(),
				value = headers.get('header-2');

			expect(value).toBeNull();
		});
	});

	describe('"has" method', () => {
		it('returns a boolean stating whether this object contains a header with a given name', () => {
			const
				headers = new Headers(arrHeaders),
				stateOfHeader1 = headers.has('header-1'),
				stateOfHeader2 = headers.has('header-4');

			expect(stateOfHeader1).toBeTrue();
			expect(stateOfHeader2).toBeFalse();
		});
	});

	describe('"keys" method', () => {
		it('returns an iterator allowing you to go through all keys of headers contained in this object', () => {
			const
				headers = new Headers(arrHeadersCopy),
				keysIter = headers.keys(),
				expectedKeys = arrHeaders.map(([name]) => name);

			expect([...keysIter]).toEqual(expectedKeys);
		});
	});

	describe('"set" method', () => {
		it('sets a new value for an existing header', () => {
			const
				headers = new Headers(arrHeadersCopy);

			headers.set('header-3', 'value-4');

			expect(headers.headers.get('header-3')).toBe('value-4');
		});

		it('adds the header if it does not already exist', () => {
			const
				headers = new Headers();

			headers.set('header', 'value');

			expect(headers.headers.get('header')).toBe('value');
		});
	});

	describe('"values" method', () => {
		it('returns an iterator allowing you to go through all values of headers', () => {
			const
				headers = new Headers(arrHeadersCopy),
				valuesIter = headers.values(),
				expectedValues = arrHeaders.map(([, value]) => value);

			expect([...valuesIter]).toEqual(expectedValues);
		});
	});
});
