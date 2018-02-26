/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export default class RequestError extends Error {
	readonly type: string;
	readonly details: any;

	/**
	 * @param type - error type
	 * @param details - error details
	 */
	constructor(type: string, details?: any) {
		super(`API error, type: ${type}`);
		this.type = type;
		this.details = details;
	}
}
