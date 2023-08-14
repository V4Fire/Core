/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/queue/order/README.md]]
 * @packageDocumentation
 */
import Queue from '../../../core/queue/interface';
import type { InnerQueue, CreateInnerQueue, ElsComparator } from '../../../core/queue/order/interface';
export * from '../../../core/queue/order/interface';
/**
 * Implementation of an ordered queue data structure based on a binary heap
 * @typeparam T - the queue element
 */
export default class OrderedQueue<T> extends Queue<T> {
    /**
     * Type: the internal queue to store elements
     */
    readonly InnerQueue: InnerQueue<T>;
    /** @inheritDoc */
    get head(): CanUndef<T>;
    /** @inheritDoc */
    get length(): number;
    /**
     * An index of the last element from the queue
     */
    protected lastIndex: number;
    /**
     * The internal queue to store elements
     */
    protected innerQueue: this['InnerQueue'];
    /**
     * A function to compare tasks
     */
    protected comparator: ElsComparator<T>;
    /**
     * @param comparator - a function to compare tasks
     */
    constructor(comparator: ElsComparator<T>);
    /** @inheritDoc */
    push(task: T): number;
    /** @inheritDoc */
    pop(): CanUndef<T>;
    /** @inheritDoc */
    clear(): void;
    /** @inheritDoc */
    clone(): OrderedQueue<T>;
    /**
     * Returns a new blank internal queue to store elements
     */
    protected createInnerQueue: CreateInnerQueue<this['InnerQueue']>;
    /**
     * Pushes the last queue element to the top
     */
    protected fromBottom(): void;
    /**
     * Pushes the first queue element down
     */
    protected toBottom(): void;
}
