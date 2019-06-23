/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

//#if runtime has core/request/response
import Response from 'core/request/response';
//#endif

export interface Details extends Dictionary {
	response?: Response;
}

export default class RequestError implements Error {
	/**
	 * Error name
	 */
	readonly name: string = 'RequestError';

	/**
	 * Error type
	 */
	readonly type: string;

	/**
	 * Error message
	 */
	readonly message: string;

	/**
	 * Error details
	 */
	readonly details: Details = {};

	/**
	 * @param type - error type
	 * @param details - error details
	 */
	constructor(type: string, details?: Details) {
		this.type = type;
		this.message = `API error, type: ${type}`;

		if (details) {
			this.details = details;
		}
	}
}
