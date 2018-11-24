/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import { asyncLocal } from 'core/kv-storage';

export interface StatusEvent {
	status: boolean;
	lastOnline?: Date;
}

export const
	event = new EventEmitter();

const
	{online} = config,
	storage = asyncLocal.namespace('[[NET]]');

let
	status,
	lastOnline,
	cache,
	syncTimer,
	retryCount = 0;

/**
 * If online returns true
 *
 * @emits online()
 * @emits offline(lastOnline: Date)
 * @emits status({status: boolean, lastOnline?: Date})
 */
export function isOnline(): Promise<{status: boolean; lastOnline?: Date}> {
	if (cache) {
		return cache;
	}

	const res = (async () => {
		const
			url = online.checkURL,
			prevStatus = status;

		let
			loadFromStorage;

		if (online.persistence && !lastOnline && url) {
			loadFromStorage = storage.get('lastOnline').then((v) => {
				if (v) {
					lastOnline = v;
				}
			});
		}

		status = await new Promise<boolean>((resolve) => {
			if (!url) {
				retryCount = 0;
				resolve(true);
				return;
			}

			const retry = () => {
				if (!online.retryCount || status === undefined || ++retryCount > online.retryCount) {
					resolve(false);

				} else {
					checkOnline();
				}
			};

			const checkOnline = () => {
				const
					img = new Image(),
					timer = setTimeout(retry, online.checkTimeout || 0);

				img.onload = () => {
					clearTimeout(timer);
					retryCount = 0;
					resolve(true);
				};

				img.onerror = () => {
					clearTimeout(timer);
					retry();
				};

				img.src = `${url}?d=${Date.now()}`;
			};

			checkOnline();
		});

		if (online.cacheTTL) {
			setTimeout(() => cache = undefined, online.cacheTTL);
		}

		const updateDate = () => {
			clearTimeout(syncTimer);
			syncTimer = undefined;

			if (online.persistence && url) {
				storage.set('lastOnline', lastOnline = new Date()).catch(stderr);
			}
		};

		if (prevStatus === undefined || status !== prevStatus) {
			if (status) {
				event.emit('online', lastOnline);

			} else {
				event.emit('offline');
			}

			updateDate();
			event.emit('status', {status, lastOnline});

		} else if (status && syncTimer != null) {
			if (online.lastDateSyncInterval) {
				syncTimer = setTimeout(updateDate, online.lastDateSyncInterval);
			}
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
}

async function onlineCheck(): Promise<void> {
	if (online.checkInterval) {
		await isOnline();
		setTimeout(onlineCheck, online.checkInterval);
	}
}

onlineCheck().catch(stderr);
