/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';

import { state, emitter } from 'core/net/const';
import { IS_NODE } from 'core/prelude/env';

const
	{online} = config;

if (!IS_NODE) {
	globalThis.addEventListener('online', () => emitter.emit('sync'));
	globalThis.addEventListener('offline', () => emitter.emit('sync'));
}

/**
 * Returns true if the current host has a connection to the internet or null
 * if the connection status can't be checked.
 *
 * This engine checks the connection by using a request for some data from the internet.
 */
export async function isOnline(): Promise<boolean | null> {
	if (!IS_NODE && navigator.onLine === false) {
		return false;
	}

	const
		url = online.checkURL;

	if (url == null || url === '') {
		return null;
	}

	let
		retriesCount = 0;

	return new Promise((resolve) => {
		const retry = () => {
			if (
				state.status == null ||
				online.retryCount == null ||
				++retriesCount > online.retryCount
			) {
				resolve(false);

			} else {
				checkOnline();
			}
		};

		checkOnline();

		function checkOnline(): void {
			const
				img = new Image(),
				timer = setTimeout(retry, online.checkTimeout ?? 0);

			img.onload = () => {
				clearTimeout(timer);
				resolve(true);
			};

			img.onerror = () => {
				clearTimeout(timer);
				retry();
			};

			img.src = `${url}?d=${Date.now()}`;
		}
	});
}
