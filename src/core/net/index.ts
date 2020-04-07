/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/net/README.md]]
 * @packageDocumentation
 */

import config from 'config';
import * as engine from 'core/net/engines';

import { emitter } from 'core/net/const';
import { NetStatus } from 'core/net/interface';

export * from 'core/net/const';
export * from 'core/net/interface';

const
	{online} = config;

let
	storage,
	status,
	lastOnline,
	cache;

//#if runtime has core/kv-storage
storage = import('core/kv-storage').then(({asyncLocal}) => asyncLocal.namespace('[[NET]]'));
//#endif

/**
 * Returns information about the internet connection status
 *
 * @emits `online()`
 * @emits `offline(lastOnline: Date)`
 * @emits `status(value:` [[NetStatus]] `)`
 */
export function isOnline(): Promise<NetStatus> {
	//#if runtime has core/net

	if (cache) {
		return cache;
	}

	const res = (async () => {
		const prevStatus = status;
		status = await engine.isOnline();

		if (status === null) {
			return {
				status: true,
				lastOnline: undefined
			};
		}

		let
			loadFromStorage;

		if (online.persistence && lastOnline == null) {
			if (!storage) {
				throw new ReferenceError('kv-storage module is not loaded');
			}

			loadFromStorage = storage.then((storage) => storage.get('lastOnline').then((v) => {
				if (v) {
					lastOnline = v;
				}
			})).catch(stderr);
		}

		if (online.cacheTTL) {
			setTimeout(() => cache = undefined, online.cacheTTL);
		}

		if (prevStatus === undefined || status !== prevStatus) {
			if (status) {
				emitter.emit('online', lastOnline);

			} else {
				emitter.emit('offline');
			}

			syncStatusWithStorage().catch(stderr);
			emitter.emit('status', {status, lastOnline});
		}

		try {
			await loadFromStorage;
		} catch {}

		return {status, lastOnline};
	})();

	if (online.cacheTTL) {
		cache = res;
	}

	return res;

	//#endif

	return Promise.resolve({
		status: true,
		lastOnline: new Date()
	});
}

let
	storageSyncTimer;

/**
 * Synchronizes the online status with a local storage
 */
export async function syncStatusWithStorage(): Promise<void> {
	if (!status || !online.persistence) {
		return;
	}

	if (!storage) {
		throw new ReferenceError('kv-storage module is not loaded');
	}

	const clear = () => {
		if (storageSyncTimer != null) {
			clearTimeout(storageSyncTimer);
			storageSyncTimer = undefined;
		}
	};

	clear();

	try {
		(await storage).
			set('lastOnline', lastOnline = new Date());

	} catch (err) {
		stderr(err);
	}

	if (online.lastDateSyncInterval) {
		clear();

		storageSyncTimer = setTimeout(() => {
			storageSyncTimer = undefined;
			syncStatusWithStorage().catch(stderr);
		}, online.lastDateSyncInterval);
	}
}

let
	checkTimer;

/**
 * Updates the online status
 */
export async function updateStatus(): Promise<void> {
	const clear = () => {
		if (checkTimer != null) {
			clearTimeout(checkTimer);
			checkTimer = undefined;
		}
	};

	clear();

	try {
		await isOnline();

	} catch (err) {
		stderr(err);

	} finally {
		if (online.checkInterval) {
			clear();
			checkTimer = setTimeout(() => {
				checkTimer = undefined;
				updateStatus();
			}, online.checkInterval);
		}
	}
}

emitter.on('sync', updateStatus);
updateStatus().catch(stderr);
