/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Storage from 'dom-storage';
import * as fs from 'fs-extra-promise';

import { Cache } from 'core/cache';

const
	tmpDir = './tmp/local';

if (!fs.existsSync(tmpDir)) {
	fs.mkdirpSync(tmpDir);
}

const
	localStorage = new Storage(`${tmpDir}/storage.json`, {strict: true, ws: ''}),
	sessionStorage = new Cache();

export const
	syncLocalStorage = localStorage,
	asyncLocalStorage = localStorage,
	syncSessionStorage = sessionStorage,
	asyncSessionStorage = sessionStorage;
