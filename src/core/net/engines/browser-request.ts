/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';
import { state, emitter } from 'core/net/const';

const
	{online} = config;

globalThis.addEventListener('online', () => emitter.emit('sync'));
globalThis.addEventListener('offline', () => emitter.emit('sync'));

/**
 * Returns true if the current host has a connection to the internet or null
 * if the connection status can't be checked.
 *
 * This engine checks the connection by using a request for some data from the internet.
 */
export async function isOnline(): Promise<boolean | null> {
	if ('onLine' in navigator && !navigator.onLine) {
		return false;
	}

	const
		url = online.checkURL;

	if (url == null || url === '') {
		return null;
	}

	return new Promise((resolve) => {
		let
			retriesCount = 0;

		let
			timer,
			timeout = false;

		if (online.checkTimeout != null) {
			timer = setTimeout(() => {
				timeout = true;
				resolve(false);
			}, online.checkTimeout);
		}

		checkOnline();

		function checkOnline() {
			const xhr = new XMLHttpRequest();
			xhr.open('OPTIONS', `${url}?_=${Date.now()}`, true);

			xhr.addEventListener('readystatechange', () => {
				if (timer != null) {
					clearTimeout(timer);
				}

				resolve(true);
			}, {once: true});

			xhr.addEventListener('error', retry, {once: true});
			xhr.send();
		}

		function retry() {
			if (timeout) {
				return;
			}

			if (
				state.status == null ||
				online.retryCount == null ||
				++retriesCount > online.retryCount
			) {
				resolve(false);

			} else {
				checkOnline();
			}
		}
	});
}
