/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { Cache } from 'core/cache';

import syncLocalEngine from 'core/kv-storage/engines/browser-indexeddb/sync-engine';
import AsyncLocalEngine from 'core/kv-storage/engines/browser-indexeddb/async-engine';

export * from 'core/kv-storage/engines/browser-indexeddb/interface';

const
	asyncLocalEngine = new AsyncLocalEngine(),
	sessionEngine = new Cache();

export const
	syncLocalStorage = syncLocalEngine,
	asyncLocalStorage = asyncLocalEngine;

// eslint-disable-next-line import/no-mutable-exports
export let
	syncSessionStorage,
	asyncSessionStorage;

if (typeof globalThis.sessionStorage !== 'undefined') {
	syncSessionStorage = globalThis.sessionStorage;
	asyncSessionStorage = globalThis.sessionStorage;

} else {
	syncSessionStorage = sessionEngine;
	asyncSessionStorage = sessionEngine;
}
