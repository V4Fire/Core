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
			got(`${url}?d=${Date.now()}`, {
				timeout: online.checkTimeout,
				throwHttpErrors: false
			}).then(resolve.bind(null, true), retry);
		}
	});
}
