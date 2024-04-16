/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { ControllablePromise } from '../../../../core/request/modules/stream-buffer/interface';
export default class StreamBuffer<T = unknown> {
    /**
     * Returns a boolean stating whether the stream is open or not
     */
    get isOpened(): boolean;
    /**
     * Buffer of added values
     */
    protected buffer: T[];
    /**
     * Current pending promise that resolves when a new value is added
     */
    protected pendingPromise: Nullable<ControllablePromise<T>>;
    /**
     * True, if an asynchronous iterator from `Symbol.asyncIterator` was called
     */
    protected isAsyncIteratorInvoked: boolean;
    /**
     * @param [values] - values to add
     */
    constructor(values?: Iterable<T>);
    /**
     * Returns an iterator allowing to go through all items that were already added
     */
    [Symbol.iterator](): IterableIterator<T>;
    /**
     * Returns an asynchronous iterator allowing to go through the stream
     */
    [Symbol.asyncIterator](): AsyncIterableIterator<T>;
    /**
     * Adds a new value to the stream if it is opened, otherwise does nothing
     * @param value - item to add
     */
    add(value: T): void;
    /**
     * Closes the stream
     */
    close(): void;
    /**
     * Destroys the stream
     * @param [reason] - reason to destroy
     */
    destroy<R = unknown>(reason?: R): void;
}
