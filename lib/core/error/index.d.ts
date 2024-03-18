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
export * from '../../core/error/interface';
/**
 * Superclass of any error to inherit
 */
export default class BaseError extends Error {
    /**
     * An error that causes the current error
     */
    readonly cause?: Error;
    /**
     * Internal storage for an error message
     */
    protected internalMessage?: string;
    constructor(message?: string, cause?: Error);
    /**
     * Formats internal error's data to produce a message.
     * The method calls when accessing the `message` property.
     */
    protected format(): string;
}
