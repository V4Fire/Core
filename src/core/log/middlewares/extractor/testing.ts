/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import BaseError, { ErrorDetailsExtractor, ErrorCtor } from '@src/core/error';

export class TestDetailedError extends Error {
	readonly reason: unknown;

	constructor(message: string, reason: unknown) {
		super(message);
		this.reason = reason;
	}
}

export class TestBaseError extends BaseError {}

export class TestDetailedBaseError extends BaseError {
	readonly reason: unknown;

	constructor(message: string, reason: unknown, cause: Error) {
		super(message, cause);
		this.reason = reason;
	}
}

export class TestExtractor implements ErrorDetailsExtractor<TestDetailedBaseError> {
	target: ErrorCtor<TestDetailedBaseError> = TestDetailedBaseError;

	extract(error: TestDetailedBaseError): unknown {
		return error.reason;
	}
}
