/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export default class RequestError {
	readonly type: string;
	readonly details: unknown;
	readonly message: string;

	/**
	 * @param type - error type
	 * @param details - error details
	 */
	constructor(type: string, details?: unknown) {
		this.type = type;
		this.details = details;
		this.message = `API error, type: ${type}`;
	}
}
