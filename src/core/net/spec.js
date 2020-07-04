/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { isOnline } from 'core/net';

describe('core/net', () => {
	it('isOnline', async () => {
		const res = await isOnline();
		expect(res.status).toBeTrue();
		expect(res.lastOnline.is(new Date(), (1).minute())).toBeTrue();
	});
});
