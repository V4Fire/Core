/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Session identifier
 */
export type SessionKey = Nullable<
	string |
	boolean
>;

/**
 * Additional session parameters
 */
export interface SessionParams extends Dictionary {
	/**
	 * Value for a CSRF token
	 */
	csrf?: string;
}

export interface Session {
	/**
	 * Session key
	 */
	auth: SessionKey;

	/**
	 * Additional session parameters
	 */
	params?: Nullable<SessionParams>;
}
