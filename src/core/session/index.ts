/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import session from 'core/session/engines';
import { Session, SessionKey } from 'core/session/interface';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';
export * from 'core/session/interface';

export const
	event = new EventEmitter({maxListeners: 100, newListener: false});

/**
 * Returns current session object
 */
export async function get(): Promise<Session> {
	try {
		const
			s = await session;

		return {
			auth: await s.get<SessionKey>('auth'),
			csrf: await s.get<SessionKey>('csrf')
		};

	} catch {
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
 * @emits set(session: Session)
 */
export async function set(auth?: SessionKey, csrf?: SessionKey): Promise<boolean> {
	try {
		const
			s = await session;

		if (auth) {
			await s.set('auth', auth);
		}

		if (csrf) {
			await s.set('csrf', csrf);
		}

		event.emit('set', {auth, csrf});

	} catch {
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
		const s = await session;
		await s.remove('auth');
		await s.remove('csrf');
		event.emit('clear');

	} catch {
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
export async function match(auth?: SessionKey, csrf?: SessionKey): Promise<boolean> {
	try {
		const s = await get();
		return auth === s.auth && csrf === s.csrf;

	} catch {
		return false;
	}
}

/**
 * Returns true if the session object is exists
 */
export async function isExists(): Promise<boolean> {
	try {
		const s = await get();
		return Boolean(s.auth && (!await (await session).has('csrf') || s.csrf));

	} catch {
		return false;
	}
}
