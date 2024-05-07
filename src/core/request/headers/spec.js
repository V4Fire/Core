/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import V4Headers from 'core/request/headers';

describe('core/request/headers', () => {
	describe('`constructor`', () => {
		it('creating headers from a dictionary', () => {
			const headers = new V4Headers({
				'Content-Language': ['en', 'ru'],
				'Cache-Control': 'no-cache'
			});

			expect(headers.get('Content-Language')).toBe('en,ru');
			expect(headers.get('Cache-Control')).toBe('no-cache');
		});

		it('creating headers from another Headers', () => {
			const headers = new V4Headers(new V4Headers({
				'Content-Language': ['en', 'ru'],
				'Cache-Control': 'no-cache'
			}));

			expect(headers.get('Content-Language')).toBe('en,ru');
			expect(headers.get('Cache-Control')).toBe('no-cache');
		});

		it('creating headers from a string', () => {
			const headers = new V4Headers(`
				Content-Language: en,ru
				Cache-control: no-cache
			`);

			expect(headers.get('Content-Language')).toBe('en,ru');
			expect(headers.get('Cache-Control')).toBe('no-cache');
		});

		it('creating headers from a string with multiline values', () => {
			const headers = new V4Headers(`
				Content-Language: en,
				                  ru
				Cache-control: no-cache
			`);

			expect(headers.get('Content-Language')).toBe('en,ru');
			expect(headers.get('Cache-Control')).toBe('no-cache');
		});

		it('creating headers from an instance of native class Headers', () => {
			const nativeHeaders = new Headers({
				'Content-Language': 'ru',
				'content-language': 'es',
				'CONTENT-LANGUAGE': 'fr',
				'Cache-Control': 'no-cache'
			});

			console.log(nativeHeaders);
			const headers = new V4Headers(nativeHeaders);

			expect(headers.get('Content-Language')).toBe('ru, es, fr');
			expect(headers.get('Cache-Control')).toBe('no-cache');
		});
	});

	describe('crud operations', () => {
		describe('with a dictionary', () => {
			it('getting a header value', () => {
				const headers = new V4Headers({
					'Cache-Control': 'no-cache'
				});

				expect(headers['cache-control']).toBe('no-cache');
			});

			it('setting a header value', () => {
				const
					headers = new V4Headers();

				headers['cache-control'] = 'no-cache';
				expect(headers.has('Cache-Control')).toBe(true);
			});

			it('deleting a header value', () => {
				const headers = new V4Headers({
					'Cache-Control': 'no-cache'
				});

				delete headers['cache-control'];
				expect(headers.has('cache-control')).toBe(false);
			});

			it('getting headers keys', () => {
				const headers = new V4Headers({
					'Content-Language': ['en', 'ru']
				});

				headers['cache-control'] = 'no-cache';
				expect(Object.keys(headers)).toEqual(['content-language', 'cache-control']);
			});

			it('freezing headers', () => {
				const headers = new V4Headers({
					'Cache-Control': 'no-cache'
				});

				Object.freeze(headers);

				try {
					headers['cache-control'] = 'no-store';
				} catch {}

				try {
					delete headers['content-control'];
				} catch {}

				try {
					headers['content-language'] = 'en';
				} catch {}

				expect(Object.entries(headers)).toEqual([['cache-control', 'no-cache']]);
			});
		});

		describe('using API', () => {
			it('getting a header value', () => {
				const headers = new V4Headers({
					'Cache-Control': 'no-cache'
				});

				expect(headers.get('Cache-Control')).toBe('no-cache');
				expect(headers.get('cache-control')).toBe('no-cache');
			});

			it('setting a header value', () => {
				const
					headers = new V4Headers();

				headers.set('cache-control', 'no-cache');
				expect(headers.get('Cache-Control')).toBe('no-cache');
			});

			it('setting a header value with normalizing', () => {
				const
					headers = new V4Headers();

				headers.set('cache-control', '  no-cache  ');
				expect(headers.get('Cache-Control')).toBe('no-cache');
			});

			it('setting a header value that is already exists', () => {
				const headers = new V4Headers({
					'Cache-Control': 'no-cache'
				});

				headers.set('cache-control', 'no-store');
				expect(headers.get('Cache-Control')).toBe('no-store');
			});

			it('setting a header multiple value that is already exists', () => {
				const headers = new V4Headers({
					'Content-Language': 'en'
				});

				headers.set('Content-Language', ['ru', 'jp']);
				expect(headers.get('Content-Language')).toBe('ru,jp');
			});

			it('appending a header multiple value with normalizing', () => {
				const headers = new V4Headers({
					'Content-Language': 'en'
				});

				headers.append('Content-Language', ['ru ', '  jp  ']);
				expect(headers.get('Content-Language')).toBe('en,ru,jp');
			});

			it('deleting a header value', () => {
				const headers = new V4Headers({
					'Content-Language': ['en', 'ru']
				});

				expect(headers.has('Content-Language')).toBe(true);
				headers.delete('Content-Language');

				expect(headers.get('Content-Language')).toBeNull();
				expect(headers.has('Content-Language')).toBe(false);
			});

			it('freezing headers', () => {
				const headers = new V4Headers({
					'Cache-Control': 'no-cache'
				});

				Object.freeze(headers);

				try {
					headers.append('Cache-Control', 'no-store');
				} catch {}

				try {
					headers.delete('cache-control');
				} catch {}

				try {
					headers.set('content-language', 'en');
				} catch {}

				expect(Object.entries(headers)).toEqual([['cache-control', 'no-cache']]);
			});
		});

		describe('iterators', () => {
			it('`keys`', () => {
				const headers = new V4Headers({
					'Content-Language': ['en', 'ru']
				});

				headers.set('Cache-Control', 'no-cache');
				expect([...headers.keys()]).toEqual(['content-language', 'cache-control']);
			});

			it('`values`', () => {
				const headers = new V4Headers({
					'Content-Language': ['en', 'ru']
				});

				headers.set('Cache-Control', 'no-cache');
				expect([...headers.values()]).toEqual(['en,ru', 'no-cache']);
			});

			it('`entries`', () => {
				const headers = new V4Headers({
					'Content-Language': ['en', 'ru']
				});

				headers.set('Cache-Control', 'no-cache');
				expect([...headers.entries()]).toEqual([
					['content-language', 'en,ru'],
					['cache-control', 'no-cache']
				]);
			});

			it('`default iterator`', () => {
				const headers = new V4Headers({
					'Content-Language': ['en', 'ru']
				});

				headers.set('Cache-Control', 'no-cache');
				expect([...headers]).toEqual([
					['content-language', 'en,ru'],
					['cache-control', 'no-cache']
				]);
			});
		});
	});
});
