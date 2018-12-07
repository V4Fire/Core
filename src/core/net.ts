/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

export interface StatusEvent {
	status: boolean;
	lastOnline?: Date;
}

export const
	event = new EventEmitter();

const
	storage = import('core/kv-storage').then(({asyncLocal}) => asyncLocal.namespace('[[NET]]'));

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

	cache = (async () => {
		const
			url = config.onlineCheckURL,
			prevStatus = status;

		let
			loadFromStorage;

		if (!lastOnline && url) {
			loadFromStorage = storage.then((storage) => storage.get('lastOnline')).then((v) => {
				if (v) {
					lastOnline = v;
				}
			}).catch(stderr);
		}

		status = await new Promise<boolean>((resolve) => {
			if (!url) {
				retryCount = 0;
				resolve(true);
				return;
			}

			const retry = () => {
				if (status === undefined || ++retryCount > config.onlineRetryCount) {
					resolve(false);

				} else {
					checkOnline();
				}
			};

			const checkOnline = () => {
				const
					img = new Image(),
					timer = setTimeout(retry, config.onlineCheckTimeout);

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

		setTimeout(() => cache = undefined, config.onlineCheckCacheTTL);

		const updateDate = () => {
			clearTimeout(syncTimer);
			syncTimer = undefined;

			if (url) {
				storage.then((storage) => storage.set('lastOnline', lastOnline = new Date())).catch(stderr);
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
			syncTimer = setTimeout(updateDate, config.onlineLastDateSyncInterval);
		}

		try {
			await loadFromStorage;
		} catch {}

		return {status, lastOnline};
	})();

	return cache;
}

async function onlineCheck(): Promise<void> {
	await isOnline();
	setTimeout(onlineCheck, config.onlineCheckInterval);
}

onlineCheck().catch(stderr);
