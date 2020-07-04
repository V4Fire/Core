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
import * as netEngine from 'core/net/engines';

import { state, emitter } from 'core/net/const';
import { NetStatus, NetEngine } from 'core/net/interface';

export * from 'core/net/const';
export * from 'core/net/interface';

const
	{online} = config;

let
	storage,
	cache;

//#if runtime has core/kv-storage
// eslint-disable-next-line prefer-const
storage = import('core/kv-storage').then(({asyncLocal}) => asyncLocal.namespace('[[NET]]'));
//#endif

/**
 * Returns information about the internet connection status
 *
 * @param [engine] - engine to test online connection
 *
 * @emits `online()`
 * @emits `offline(lastOnline: Date)`
 * @emits `status(value:` [[NetStatus]] `)`
 */
export function isOnline(
	engine: NetEngine = netEngine
): Promise<NetStatus> {
	//#if runtime has core/net

	if (cache != null) {
		return cache;
	}

	const res = (async () => {
		const prevStatus = state.status;

		// eslint-disable-next-line require-atomic-updates
		state.status = await engine.isOnline();

		if (state.status == null) {
			return {
				status: true,
				lastOnline: undefined
			};
		}

		if (online.persistence && state.lastOnline == null) {
			if (storage == null) {
				throw new ReferenceError("kv-storage module isn't loaded");
			}

			try {
				const
					lastStoredOnline = await (await storage).get('lastOnline');

				if (lastStoredOnline != null) {
					// eslint-disable-next-line require-atomic-updates
					state.lastOnline = lastStoredOnline;
				}

			} catch {}
		}

		if (online.cacheTTL != null) {
			setTimeout(() => cache = undefined, online.cacheTTL);
		}

		if (prevStatus === undefined || state.status !== prevStatus) {
			if (state.status) {
				emitter.emit('online', state.lastOnline);

			} else {
				emitter.emit('offline');
			}

			syncStatusWithStorage().catch(stderr);
			emitter.emit('status', {...<NetStatus>state});
		}

		return {...<NetStatus>state};
	})();

	if (online.cacheTTL != null) {
		cache = res;
	}

	return res;

	//#endif

	// eslint-disable-next-line no-unreachable
	return Promise.resolve({
		status: true
	});
}

let
	storageSyncTimer;

/**
 * Synchronizes the online status with a local storage
 */
export async function syncStatusWithStorage(): Promise<void> {
	if (state.status !== true) {
		return;
	}

	state.lastOnline = new Date();

	const clear = () => {
		if (storageSyncTimer != null) {
			clearTimeout(storageSyncTimer);
			storageSyncTimer = undefined;
		}
	};

	clear();

	if (online.persistence) {
		if (storage == null) {
			throw new ReferenceError("kv-storage module isn't loaded");
		}

		try {
			await (await storage).set('lastOnline', state.lastOnline);

		} catch (err) {
			stderr(err);
		}
	}

	if (online.lastDateSyncInterval != null) {
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
	}

	if (online.checkInterval != null) {
		clear();

		checkTimer = setTimeout(() => {
			checkTimer = undefined;
			updateStatus().catch(stderr);
		}, online.checkInterval);
	}
}

emitter.on('sync', updateStatus);
updateStatus().catch(stderr);
