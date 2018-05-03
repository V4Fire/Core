/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import session from 'core/session/engines';

/**
 * Returns the current session object
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
 */
export async function set(auth?: string | undefined, csrf?: string | undefined): Promise<boolean> {
	try {
		if (auth) {
			await session.set('auth', auth);
		}

		if (csrf) {
			await session.set('csrf', csrf);
		}

	} catch (_) {
		return false;
	}

	return true;
}

/**
 * Clears the current session
 */
export async function clear(): Promise<boolean> {
	try {
		await session.remove('auth');
		await session.remove('csrf');

	} catch (_) {
		return false;

	} finally {
		location.href = '/';
	}

	return true;
}

/**
 * Matches the specified session and the current
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
 * @param [onlyJWT] - if true, then the session will be checked without csrf token
 */
export async function isExists(onlyJWT?: boolean): Promise<boolean> {
	try {
		const s = await get();
		return Boolean(s.auth && (onlyJWT || s.csrf));

	} catch (_) {
		return false;
	}
}
