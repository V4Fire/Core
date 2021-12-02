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

import BaseError from '@src/core/error';
import type { Details } from '@src/core/request/error/interface';

export * from '@src/core/request/error/interface';
export * from '@src/core/request/error/extractor';

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

	protected override format(): string {
		const
			d = this.details;

		const parts = [
			d.request?.method,
			d.request?.path,
			d.response?.status
		];

		const
			head = `[${this.type}]`,
			body = parts.filter((p) => p != null).join(' ');

		if (body.length > 0) {
			return `${head} ${body}`;
		}

		return head;
	}
}
