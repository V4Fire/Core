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

import { BaseError } from 'core/error';
import type { Details } from 'core/request/error/interface';

export * from 'core/request/error/interface';

/**
 * Class to wrap a request error
 */
export default class RequestError<D = undefined> extends BaseError {
	/**
	 * Error type
	 */
	readonly type: string;

	/**
	 * Error details
	 */
	readonly details: Details<D> = {};

	/**
	 * @param type - error type
	 * @param details - error details
	 */
	constructor(type: string, details?: Details<D>) {
		super();

		this.type = type;

		if (details) {
			this.details = details;
		}
	}

	/** @override */
	protected format(): string {
		return `Api error, type: ${this.type}`;
	}
}
