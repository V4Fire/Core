/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import got from 'got';
import config from 'config';
import { state } from 'core/net/const';

const
	{online} = config;

/**
 * Returns true if the current host has a connection to the internet or null
 * if the connection status can't be checked.
 *
 * This engine checks the connection by using a request for some data from the internet.
 */
export async function isOnline(): Promise<boolean | null> {
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
			got(`${url}?_=${Date.now()}`, {throwHttpErrors: false, method: 'OPTIONS'}).then(() => {
				if (timer != null) {
					clearTimeout(timer);
				}

				resolve(true);
			}, retry);
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
