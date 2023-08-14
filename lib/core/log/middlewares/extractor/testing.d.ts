/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import BaseError, { ErrorDetailsExtractor, ErrorCtor } from '../../../../core/error';
export declare class TestDetailedError extends Error {
    readonly reason: unknown;
    constructor(message: string, reason: unknown);
}
export declare class TestBaseError extends BaseError {
}
export declare class TestDetailedBaseError extends BaseError {
    readonly reason: unknown;
    constructor(message: string, reason: unknown, cause: Error);
}
export declare class TestExtractor implements ErrorDetailsExtractor<TestDetailedBaseError> {
    target: ErrorCtor<TestDetailedBaseError>;
    extract(error: TestDetailedBaseError): unknown;
}
