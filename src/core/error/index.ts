/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Base error class of v4fire
 */
export class BaseError extends Error {
	constructor(message?: string) {
		super(message);

		this.name = new.target.name;

		// Change prototype of 'this' only if it's corrupted
		if (Object.getPrototypeOf(this) === Error.prototype) {
			Object.setPrototypeOf(this, new.target.prototype);

			// Left all unnecessary frames from stack trace
			// @see https://v8.dev/docs/stack-trace-api#stack-trace-collection-for-custom-exceptions
			if ('captureStackTrace' in Error) {
				Error.captureStackTrace(this, new.target);
			}
		}
	}
}
