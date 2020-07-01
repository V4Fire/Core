/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import request from 'core/request';

describe('core/request', () => {
	it('json get', async () => {
		expect((await request('https://run.mocky.io/v3/bc04b660-5e52-4c10-a58c-539fb854516b')).data)
			.toEqual({hello: 'world'});
	});

	it('text/xml get', async () => {
		expect((await request('https://run.mocky.io/v3/69575792-41b0-4857-8e74-b87b1f55fbf1')).data.querySelector('foo').textContent)
			.toBe('Hello world');
	});

	it('application/xml get', async () => {
		expect((await request('https://run.mocky.io/v3/676b051e-3fb3-4bf5-b2c6-79732445eb44')).data.querySelector('foo').textContent)
			.toBe('Hello world');
	});
});
