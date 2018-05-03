/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { GLOBAL } from 'core/const/links';

export let
	syncLocalStorage = GLOBAL.localStorage,
	asyncLocalStorage = GLOBAL.localStorage,
	syncSessionStorage = GLOBAL.sessionStorage,
	asyncSessionStorage = GLOBAL.sessionStorage;
