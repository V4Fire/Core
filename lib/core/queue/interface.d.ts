/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export interface InnerQueue<T = unknown> {
    readonly length: number;
    readonly head?: CanUndef<T>;
    [Symbol.iterator](): IterableIterator<T>;
    push(task: T): number;
    unshift(task: T): number;
    pop(): CanUndef<T>;
    shift(): CanUndef<T>;
    clone?(): InnerQueue<T>;
}
export interface CreateInnerQueue<T extends InnerQueue<any> = InnerQueue> {
    (): T;
}
export interface QueueOptions<T extends InnerQueue<any> = InnerQueue> {
    /**
     * A factory to create an internal queue to store elements
     */
    queueFactory?: CreateInnerQueue<T>;
}
/**
 * An abstract class for any queue data structure
 * @typeparam T - queue element
 */
export default abstract class Queue<T> {
    /**
     * The first element in the queue
     */
    abstract readonly head: CanUndef<T>;
    /**
     * Number of elements in the queue
     */
    abstract readonly length: number;
    /**
     * Adds a new element to the queue
     * @param el
     */
    abstract push(el: T): unknown;
    /**
     * Removes the head element from the queue and returns it
     */
    abstract pop(): CanUndef<T>;
    /**
     * Alias to `push`
     * @see [[Queue.push]]
     */
    unshift(el: T): ReturnType<this['push']>;
    /**
     * Alias to `pop`
     * @see [[Queue.pop]]
     */
    shift(): ReturnType<this['pop']>;
    /**
     * Clears the queue
     */
    abstract clear(): void;
    /**
     * Creates a new queue based on the current one and returns it
     */
    abstract clone(): Queue<T>;
    /**
     * Returns an iterator over the queue elements
     */
    [Symbol.iterator](): IterableIterator<T>;
    /**
     * Returns an iterator over the queue elements
     */
    values(): IterableIterator<T>;
}
