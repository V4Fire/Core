/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Storage from 'dom-storage';
import * as fs from 'fs-extra';
import config from 'config';

import { Cache } from 'core/cache';

export * from 'core/kv-storage/engines/node-localstorage/interface';

const {nodePath} = config.kvStorage;

if (!fs.existsSync(nodePath)) {
	fs.mkdirpSync(nodePath);
}

const
	localStorage = new Storage(`${nodePath}/storage.json`, {strict: true, ws: ''}),
	sessionStorage = new Cache();

export const
	syncLocalStorage = localStorage,
	asyncLocalStorage = localStorage,
	syncSessionStorage = sessionStorage,
	asyncSessionStorage = sessionStorage;
