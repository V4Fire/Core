/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import Super from '../../../core/async/proxy/promise';
import type { AsyncOptions, ClearOptionsId } from '../../../core/async/core';
export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
    /**
     * Creates a new asynchronous iterable object from the specified iterable and returns it.
     * If the passed iterable doesn't have `Symbol.asyncIterator`,
     * it will be created from the synchronous object iterator (the synchronous iterator will also be preserved).
     *
     * Note: Until the created promise object is executed by invoking the `next` method,
     * any asynchronous operations will not be registered.
     *
     * @param iterable
     * @param [opts] - additional options for the operation
     *
     * @example
     * ```js
     * const async = new Async();
     *
     * for await (const el of async.iterable([1, 2, 3, 4])) {
     *   console.log(el);
     * }
     * ```
     */
    iterable<T>(iterable: AnyIterable<T>, opts?: AsyncOptions): AsyncIterable<T> | AsyncIterable<T> & Iterable<T>;
    /**
     * Cancels the specified iterable object.
     * Note that cancellation affects only objects that have already been activated by invoking the `next` method.
     * For example, canceled iterable will throw an error on the next invocation of next.
     *
     * @alias
     * @param [id] - a reference to the iterable to be canceled
     *   (if not specified, the operation will be applied to all registered tasks)
     */
    cancelIterable(id?: AsyncIterable<unknown>): this;
    /**
     * Cancels the specified iterable or a group of iterable.
     * Note that cancellation affects only objects that have already been activated by invoking the `next` method.
     * For example, canceled iterable will throw an error on the next invocation of next.
     *
     * @alias
     * @param opts - options for the operation
     */
    cancelIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
    /**
     * Cancels the specified iterable object.
     * Note that cancellation affects only objects that have already been activated by invoking the `next` method.
     * For example, canceled iterable will throw an error on the next invocation of next.
     *
     * @param [id] - a reference to the iterable to be canceled
     *   (if not specified, the operation will be applied to all registered tasks)
     */
    clearIterable(id?: Promise<unknown>): this;
    /**
     * Cancels the specified iterable object.
     * Note that cancellation affects only objects that have already been activated by invoking the `next` method.
     * For example, canceled iterable will throw an error on the next invocation of next.
     *
     * @param opts - options for the operation
     */
    clearIterable(opts: ClearOptionsId<Promise<unknown>>): this;
    /**
     * Mutes the specified iterable object.
     * Elements that are consumed while the object is muted will be ignored.
     * Note that muting affects only objects that have already been activated by invoking the `next` method.
     *
     * @param [id] - a reference to the iterable to be muted
     *   (if not specified, the operation will be applied to all registered tasks)
     */
    muteIterable(id?: AsyncIterable<unknown>): this;
    /**
     * Mutes the specified iterable object or a group of iterable objects.
     * Elements that are consumed while the object is muted will be ignored.
     * Note that muting affects only objects that have already been activated by invoking the `next` method.
     *
     * @param opts - options for the operation
     */
    muteIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
    /**
     * Unmutes the specified iterable object
     *
     * @param [id] - a reference to the iterable to be unmuted
     *   (if not specified, the operation will be applied to all registered tasks)
     */
    unmuteIterable(id?: AsyncIterable<unknown>): this;
    /**
     * Unmutes the specified iterable function or a group of iterable objects
     * @param opts - options for the operation
     */
    unmuteIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
    /**
     * Suspends the specified iterable object.
     * Note that suspending affects only objects that have already been activated by invoking the `next` method.
     *
     * @param [id] - a reference to the iterable to be suspended
     *   (if not specified, the operation will be applied to all registered tasks)
     */
    suspendIterable(id?: AsyncIterable<unknown>): this;
    /**
     * Suspends the specified iterable or a group of iterable objects.
     * Note that suspending affects only objects that have already been activated by invoking the `next` method.
     *
     * @param opts - options for the operation
     */
    suspendIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
    /**
     * Unsuspends the specified iterable object
     *
     * @param [id] - a reference to the iterable to be unsuspended
     *   (if not specified, the operation will be applied to all registered tasks)
     */
    unsuspendIterable(id?: AsyncIterable<unknown>): this;
    /**
     * Unsuspends the specified iterable or a group of iterable objects
     * @param opts - options for the operation
     */
    unsuspendIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
    /**
     * Returns an iterator from the passed iterable object.
     * Notice, an asynchronous iterator has more priority.
     *
     * @param [iterable]
     */
    protected getBaseIterator<T>(iterable: AnyIterable<T>): CanUndef<AnyIterableIterator<T>>;
}
