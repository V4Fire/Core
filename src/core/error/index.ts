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

/**
 * Base error class of v4fire
 */
export class BaseError extends Error {
	/**
	 * An error that causes the current error
	 */
	readonly cause?: Error;

	/**
	 * Internal storage for message
	 */
	protected internalMessage?: string;

	constructor(message?: string, cause?: Error) {
		super(message);

		this.name = new.target.name;
		this.internalMessage = message;
		this.cause = cause;

		Object.defineProperty(this, 'message', {
			enumerable: false,
			configurable: true,

			get(): string {
				return this.format();
			},

			set(newValue: string): void {
				this.internalMessage = newValue;
			}
		});

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

	/**
	 * Formats internal error's data to produce a message.
	 * The method calls when accessing message property.
	 */
	protected format(): string {
		return this.internalMessage ?? '';
	}
}
