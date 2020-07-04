/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';
import { isOnline } from 'core/net';

describe('core/net', () => {
	const
		originalURL = config.online.checkURL;

	it('isOnline', async () => {
		config.online.checkURL = 'https://google.com/favicon.ico';

		expect(await isOnline()).toEqual({status: true, lastOnline: undefined});

		config.online.checkURL = '';

		expect(await isOnline()).toEqual({status: true, lastOnline: undefined});

		config.online.checkURL = originalURL;
	});
});
