/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import session from 'core/session/engines';

/**
 * Sets a new session
 *
 * @param [jwt]
 * @param [xsrf]
 */
export async function setSession(jwt?: string | undefined, xsrf?: string | undefined): Promise<boolean> {
	try {
		if (jwt) {
			await session.set('jwt', jwt);
		}

		if (xsrf) {
			await session.set('xsrf', xsrf);
		}

	} catch (_) {
		return false;
	}

	return true;
}

/**
 * Returns the current session object
 */
export async function getSession(): Promise<{xsrf: string | undefined; jwt: string | undefined}> {
	try {
		return {
			jwt: await session.get('jwt'),
			xsrf: await session.get('xsrf')
		};

	} catch (_) {
		return {
			jwt: undefined,
			xsrf: undefined
		};
	}
}

/**
 * Clears the current session
 */
export async function clearSession(): Promise<boolean> {
	try {
		session.remove('jwt');
		session.remove('xsrf');

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
 * @param [jwt]
 * @param [xsrf]
 */
export async function matchSession(jwt?: string | undefined, xsrf?: string | undefined): Promise<boolean> {
	try {
		const s = await getSession();
		return jwt === s.jwt && xsrf === s.xsrf;

	} catch (_) {
		return false;
	}
}

/**
 * Returns true if the session object is exists
 * @param [onlyJWT] - if true, then the session will be checked without xsrf token
 */
export async function isSessionExists(onlyJWT?: boolean): Promise<boolean> {
	try {
		const s = await getSession();
		return Boolean(s.jwt && (onlyJWT || s.xsrf));

	} catch (_) {
		return false;
	}
}
