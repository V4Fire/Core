/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/error/README.md]]
 * @packageDocumentation
 */

export * from 'core/error/interface';

/**
 * Superclass of any error to inherit
 */
export default class BaseError extends Error {
	/**
	 * An error that causes the current error
	 */
	override readonly cause?: Error;

	/**
	 * Internal storage for an error message
	 */
	protected internalMessage?: string;

	constructor(message?: string, cause?: Error) {
		super(message);

		// All following fields are not enumerable
		Object.defineProperties(this, {
			name: {value: new.target.name},
			internalMessage: {value: message},
			cause: {value: cause},
			message: {
				get(): string {
					return this.format();
				},

				set(newValue: string): void {
					this.internalMessage = newValue;
				}
			}
		});

		// Change a prototype of 'this' only if it's corrupted
		if (Object.getPrototypeOf(this) === Error.prototype) {
			Object.setPrototypeOf(this, new.target.prototype);

			// Left all unnecessary frames from the stack trace
			// @see https://v8.dev/docs/stack-trace-api#stack-trace-collection-for-custom-exceptions
			if ('captureStackTrace' in Error) {
				Error.captureStackTrace(this, new.target);
			}
		}
	}

	/**
	 * Formats internal error's data to produce a message.
	 * The method calls when accessing the `message` property.
	 */
	protected format(): string {
		return this.internalMessage ?? '';
	}
}
