/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/error/README.md]]
 * @packageDocumentation
 */

import { Details } from 'core/request/error/interface';
export * from 'core/request/error/interface';

/**
 * Class to wrap a request error
 */
export default class RequestError<D> implements Error {
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
	readonly details: Details<D> = {};

	/**
	 * @param type - error type
	 * @param details - error details
	 */
	constructor(type: string, details?: Details<D>) {
		this.type = type;
		this.message = `API error, type: ${type}`;

		if (details) {
			this.details = details;
		}
	}
}
