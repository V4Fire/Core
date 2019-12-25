/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type SessionKey = Nullable<
	string |
	boolean
>;

export interface SessionParams extends Dictionary {
	csrf?: string;
}

export interface Session {
	auth: SessionKey;
	params?: Nullable<SessionParams>;
}
