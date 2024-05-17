/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/queue/simple/README.md]]
 * @packageDocumentation
 */
import LinkedList from '../../../core/linked-list';
import Queue from '../../../core/queue/interface';
import type { CreateInnerQueue } from '../../../core/queue/simple/interface';
export * from '../../../core/queue/interface';
/**
 * Implementation of a queue data structure based on a linked-list
 * @typeparam T - the queue element
 */
export default class SimpleQueue<T> extends Queue<T> {
    /**
     * Type: the internal queue to store elements
     */
    readonly InnerQueue: LinkedList<T>;
    /** @inheritDoc */
    get head(): CanUndef<T>;
    /** @inheritDoc */
    get length(): number;
    /**
     * The internal queue to store elements
     */
    protected innerQueue: this['InnerQueue'];
    /** @override */
    constructor();
    /** @inheritDoc */
    push(task: T): number;
    /** @inheritDoc */
    pop(): CanUndef<T>;
    /** @inheritDoc */
    clear(): void;
    /** @inheritDoc */
    clone(): SimpleQueue<T>;
    values(): IterableIterator<T>;
    /**
     * Returns a new blank internal queue to store elements
     */
    protected createInnerQueue: CreateInnerQueue<this['InnerQueue']>;
}
