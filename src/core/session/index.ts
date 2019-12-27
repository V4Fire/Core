/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import session from 'core/session/engines';

import { emitter } from 'core/session/const';
import { Session, SessionKey, SessionParams } from 'core/session/interface';

export * from 'core/session/const';
export * from 'core/session/interface';

/**
 * Returns information about the current session
 */
export async function get(): Promise<Session> {
	try {
		const
			s = await session;

		const [auth, params] = await Promise.all([
			s.get<SessionKey>('auth'),
			s.get<Dictionary>('params')
		]);

		return {
			auth,
			params
		};

	} catch {
		return {
			auth: undefined
		};
	}
}

/**
 * Sets a new session with the specified parameters
 *
 * @param [auth]
 * @param [params] - additional parameters
 * @emits set(session: Session)
 */
export async function set(auth?: SessionKey, params?: SessionParams): Promise<boolean> {
	try {
		const
			s = await session;

		if (auth) {
			await s.set('auth', auth);
		}

		if (params) {
			await s.set('params', params);
		}

		emitter.emit('set', {auth, params});

	} catch {
		return false;
	}

	return true;
}

/**
 * Clears the current session
 * @emits clear()
 */
export async function clear(): Promise<boolean> {
	try {
		const s = await session;
		await Promise.all([s.remove('auth'), s.remove('params')]);
		emitter.emit('clear');

	} catch {
		return false;
	}

	return true;
}

/**
 * Matches a session with the current
 *
 * @param [auth]
 * @param [params]
 */
export async function match(auth?: SessionKey, params?: SessionParams): Promise<boolean> {
	try {
		const s = await get();
		return auth === s.auth && (params === undefined || Object.fastCompare(params, s.params));

	} catch {
		return false;
	}
}

/**
 * Returns true if a session is already exists
 */
export async function isExists(): Promise<boolean> {
	try {
		return Boolean((await get()).auth);

	} catch {
		return false;
	}
}
