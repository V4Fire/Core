/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface NetStatus {
	/**
	 * If true, then a host have connection to the internet
	 */
	status: boolean;

	/**
	 * Date of last online session
	 */
	lastOnline?: Date;
}
