/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as fs from 'fs-extra-promise';
import Storage from 'node-localstorage';
import { Cache } from 'core/cache';

const
	{LocalStorage} = Storage,
	tmpDir = './tmp/local';

if (!fs.existsSync(tmpDir)) {
	fs.mkdirpSync(tmpDir);
}

const
	localStorage = new LocalStorage(tmpDir),
	sessionStorage = new Cache();

export const
	syncLocalStorage = localStorage,
	asyncLocalStorage = localStorage,
	syncSessionStorage = sessionStorage,
	asyncSessionStorage = sessionStorage;
