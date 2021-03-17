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

import BaseError from 'core/error';
import type { Details } from 'core/request/error/interface';

export * from 'core/request/error/interface';
export * from 'core/request/error/extractor';

/**
 * Class to wrap any request error
 */
export default class RequestError<D = undefined> extends BaseError {
	/**
	 * Error type
	 */
	readonly type: string;

	/**
	 * Error details
	 */
	readonly details: Details<D>;

	/**
	 * @param type - error type
	 * @param details - error details
	 */
	constructor(type: string, details?: Details<D>) {
		super();

		this.type = type;
		this.details = details ?? {};
	}

	/** @override */
	protected format(): string {
		const parts = [
			this.details.request?.method,
			this.details.request?.path,
			this.details.response?.status
		];

		const
			requestInfo = parts.filter((p) => p != null).join(' ');

		return requestInfo.length > 0 ? `[${this.type}] ${requestInfo}` : `[${this.type}]`;
	}
}
