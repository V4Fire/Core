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
import BaseError from '../../../core/error';
import type { Details } from '../../../core/request/error/interface';
export * from '../../../core/request/error/interface';
export * from '../../../core/request/error/extractor';
/**
 * Class to wrap any request error
 */
export default class RequestError<D = undefined> extends BaseError {
    /**
     * Default error type: a server has responded with a non-ok status
     */
    static readonly InvalidStatus: string;
    /**
     * Default error type: a request was aborted
     */
    static readonly Abort: string;
    /**
     * Default error type: a request was aborted because of a timeout
     */
    static readonly Timeout: string;
    /**
     * Default error type: a request was failed because there is no connection to a network
     */
    static readonly Offline: string;
    /**
     * Default error type: a request was failed because of an internal request engine' error
     */
    static readonly Engine: string;
    /**
     * Error type
     */
    readonly type: string;
    /**
     * Error details
     */
    readonly details: WeakRef<Details<D>>;
    /**
     * @param type - error type
     * @param [details] - error details
     */
    constructor(type: string, details?: Details<D>);
    protected format(): string;
}
