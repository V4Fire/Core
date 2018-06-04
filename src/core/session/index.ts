/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import session from 'core/session/engines';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

export const
	event = new EventEmitter();

/**
 * Returns current session object
 */
export async function get(): Promise<{auth: string | undefined; csrf: string | undefined}> {
	try {
		return {
			auth: await session.get('auth'),
			csrf: await session.get('csrf')
		};

	} catch (_) {
		return {
			auth: undefined,
			csrf: undefined
		};
	}
}

/**
 * Sets a new session
 *
 * @param [auth]
 * @param [csrf]
 * @emits set({auth?: string, csrf?: string})
 */
export async function set(auth?: string | undefined, csrf?: string | undefined): Promise<boolean> {
	try {
		if (auth) {
			await session.set('auth', auth);
		}

		if (csrf) {
			await session.set('csrf', csrf);
		}

		event.emit('set', {auth, csrf});

	} catch (_) {
		return false;
	}

	return true;
}

/**
 * Clears current session
 * @emits clear()
 */
export async function clear(): Promise<boolean> {
	try {
		await session.remove('auth');
		await session.remove('csrf');
		event.emit('clear');

	} catch (_) {
		return false;
	}

	return true;
}

/**
 * Matches the specified session and current
 *
 * @param [auth]
 * @param [csrf]
 */
export async function match(auth?: string | undefined, csrf?: string | undefined): Promise<boolean> {
	try {
		const s = await get();
		return auth === s.auth && csrf === s.csrf;

	} catch (_) {
		return false;
	}
}

/**
 * Returns true if the session object is exists
 */
export async function isExists(): Promise<boolean> {
	try {
		const s = await get();
		return Boolean(s.auth && (!session.has('csrf') || s.csrf));

	} catch (_) {
		return false;
	}
}
