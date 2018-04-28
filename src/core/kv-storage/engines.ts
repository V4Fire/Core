/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { IS_NODE, GLOBAL } from 'core/const/links';

export let
	syncLocalStorage,
	asyncLocalStorage,
	syncSessionStorage,
	asyncSessionStorage;

if (IS_NODE) {
	// tslint:disable
	//#if node_js

	const
		fs = require('fs-extra-promise'),
		{LocalStorage} = require('node-localstorage');

	const
		tmp = './tmp/local';

	if (!fs.existsSync(tmp)) {
		fs.mkdirpSync(tmp);
	}

	const
		localStorage = new LocalStorage(tmp),
		sessionStorage = require('localstorage-memory');

	syncLocalStorage = localStorage;
	asyncLocalStorage = localStorage;
	syncSessionStorage = sessionStorage;
	asyncSessionStorage = sessionStorage;

	//#endif
	// tslint:enable

} else {
	syncLocalStorage = GLOBAL.localStorage;
	asyncLocalStorage = GLOBAL.localStorage;
	syncSessionStorage = GLOBAL.sessionStorage;
	asyncSessionStorage = GLOBAL.sessionStorage;
}
