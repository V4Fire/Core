/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export let
	syncLocalStorage,
	asyncLocalStorage;

export const
	syncSessionStorage = globalThis.sessionStorage,
	asyncSessionStorage = globalThis.sessionStorage;

try {
	if (typeof globalThis.localStorage !== 'undefined') {
		syncLocalStorage = globalThis.localStorage;
		asyncLocalStorage = globalThis.localStorage;
	}

} catch {
	syncLocalStorage = syncSessionStorage;
	asyncLocalStorage = asyncSessionStorage;
}
