/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { IS_NODE } from '~/core/env';

// eslint-disable-next-line import/no-mutable-exports
export let
	syncLocalStorage,
	asyncLocalStorage,
	syncSessionStorage,
	asyncSessionStorage;

if (IS_NODE) {
	//#if node_js
	({syncLocalStorage, asyncLocalStorage, syncSessionStorage, asyncSessionStorage} =
		require('~/core/kv-storage/engines/node-localstorage'));
	//#endif

} else {
	({syncLocalStorage, asyncLocalStorage, syncSessionStorage, asyncSessionStorage} =
		require('~/core/kv-storage/engines/browser-localstorage'));
}
