/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

export const
	event = new EventEmitter();

let
	onlineStatus;

/**
 * If online returns true
 */
export async function isOnline(): Promise<boolean> {
	const
		prev = onlineStatus,
		img = new Image();

	onlineStatus = await new Promise<boolean>((resolve) => {
		img.onload = () => resolve(true);
		img.onerror = () => resolve(false);
		img.src = `${config.onlineCheckURL}?d=${Date.now()}`;
	});

	if (prev === undefined || onlineStatus !== prev) {
		event.emit(onlineStatus ? 'online' : 'offline');
		event.emit('status', onlineStatus);
	}

	return onlineStatus;
}

async function onlineCheck(): Promise<void> {
	await isOnline();
	setTimeout(onlineCheck, config.onlineCheckInterval);
}

onlineCheck().catch(stderr);
