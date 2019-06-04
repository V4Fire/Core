/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

// tslint:disable:no-var-requires comment-format

import { IS_NODE } from 'core/env';

export let
	syncLocalStorage,
	asyncLocalStorage,
	syncSessionStorage,
	asyncSessionStorage;

// tslint:disable-next-line
if (IS_NODE) {
	//#if node_js
	({syncLocalStorage, asyncLocalStorage, syncSessionStorage, asyncSessionStorage} =
		// @ts-ignore
		require('core/kv-storage/engines/node.localstorage'));
	//#endif

} else {
	({syncLocalStorage, asyncLocalStorage, syncSessionStorage, asyncSessionStorage} =
		// @ts-ignore
		require('core/kv-storage/engines/browser.localstorage'));
}
